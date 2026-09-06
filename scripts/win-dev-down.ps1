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

foreach ($item in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $item.Port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            try {
                $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
                $procName = if ($p) { $p.ProcessName } else { "Unknown" }
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                Write-Host "  [OK] Terminated $($item.Name) on port $($item.Port) (PID: $procId - $procName)" -ForegroundColor Green
                $stoppedCount++
            } catch {
                Write-Host "  [ERR] Failed to terminate PID $procId on port $($item.Port)" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "  [-] $($item.Name) on port $($item.Port) is not running." -ForegroundColor DarkGray
    }
}

Write-Host "`nCleaned up $stoppedCount running service process(es)." -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

