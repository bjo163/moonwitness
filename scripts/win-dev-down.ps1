# MOONWITNESS OS - WINDOWS MULTI-SERVICE DEV STOPPER
$ErrorActionPreference = "SilentlyContinue"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "MOONWITNESS OS - STOPPING DEV SERVICES (WINDOWS)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$ports = @(
    @{ Port = 4000; Name = "API Backend" },
    @{ Port = 3001; Name = "Command Center" },
    @{ Port = 3000; Name = "Public Web Portal" },
    @{ Port = 8001; Name = "Celestial Engine" },
    @{ Port = 8002; Name = "AI Agent" }
)

$stoppedCount = 0
$repoPath = (Resolve-Path "$PSScriptRoot\..").Path

# ── 1. Target Active Listeners by Port ──────────────────────────────────────
foreach ($item in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $item.Port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            if ($procId -gt 0 -and $procId -ne $PID) {
                # Find direct children or multiprocessing spawn children (e.g. uvicorn workers)
                $children = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
                    Where-Object { $_.ParentProcessId -eq $procId -or $_.CommandLine -like "*parent_pid=$procId*" }
                
                foreach ($child in $children) {
                    & taskkill.exe /PID $child.ProcessId /T /F 2>$null
                    Stop-Process -Id $child.ProcessId -Force -ErrorAction SilentlyContinue
                    $stoppedCount++
                }

                # Terminate owning process
                $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
                $procName = if ($p) { $p.ProcessName } else { "Unknown" }
                & taskkill.exe /PID $procId /T /F 2>$null
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue

                # Verify port status
                Start-Sleep -Milliseconds 100
                $stillListening = Get-NetTCPConnection -LocalPort $item.Port -State Listen -ErrorAction SilentlyContinue
                if (-not $stillListening) {
                    Write-Host "  [OK] Terminated $($item.Name) on port $($item.Port) (PID: $procId - $procName)" -ForegroundColor Green
                    $stoppedCount++
                } else {
                    Write-Host "  [WARN] Port $($item.Port) still in use, running deep kill..." -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "  [-] $($item.Name) on port $($item.Port) is not running." -ForegroundColor DarkGray
    }
}

# ── 2. Deep Sweep: Python Microservice Workers (Uvicorn / Multiprocessing) ───
$pythonWorkers = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object {
        ($_.Name -like "python*" -or $_.Name -eq "uvicorn.exe") -and
        ($_.CommandLine -like "*celestial-engine*" -or 
         $_.CommandLine -like "*ai-agent*" -or 
         $_.CommandLine -like "*multiprocessing.spawn*" -or
         $_.CommandLine -like "*8001*" -or 
         $_.CommandLine -like "*8002*")
    }

if ($pythonWorkers) {
    foreach ($py in $pythonWorkers) {
        & taskkill.exe /PID $py.ProcessId /T /F 2>$null
        Stop-Process -Id $py.ProcessId -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] Cleaned up Python microservice worker ($($py.Name) PID: $($py.ProcessId))" -ForegroundColor Green
        $stoppedCount++
    }
}

# ── 3. Deep Sweep: Node.js / Runner Windows associated with repo ─────────────
$orphanNodes = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { 
        ($_.Name -in @("node.exe", "tsx.exe", "pnpm.exe") -or 
         (($_.Name -eq "cmd.exe" -or $_.Name -eq "powershell.exe") -and ($_.CommandLine -like "*MW-*" -or $_.CommandLine -like "*scripts\runners\*"))) -and
        $_.CommandLine -like "*$repoPath*" -and 
        $_.ProcessId -ne $PID 
    }

if ($orphanNodes) {
    foreach ($nodeProc in $orphanNodes) {
        & taskkill.exe /PID $nodeProc.ProcessId /T /F 2>$null
        Stop-Process -Id $nodeProc.ProcessId -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] Cleaned up runner/orphan process ($($nodeProc.Name) PID: $($nodeProc.ProcessId))" -ForegroundColor Green
        $stoppedCount++
    }
}

Write-Host "`nCleaned up $stoppedCount running service process(es)." -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan



