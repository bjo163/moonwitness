# MOONWITNESS OS - WINDOWS MULTI-SERVICE DEV RUNNER
param(
    [ValidateSet("cmd", "wt", "powershell", "turbo")]
    [string]$Mode = "cmd",
    [switch]$NoPython,
    [switch]$KeepExisting
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "MOONWITNESS OS - WINDOWS MULTI-SERVICE DEV RUNNER" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Workspace Root: $RepoRoot" -ForegroundColor DarkGray
Write-Host "Execution Mode: $Mode (Dedicated Windows CMD per service)" -ForegroundColor DarkGray

# 1. Service Definitions (All 5 Polyglot Services)
$services = @(
    @{
        Id = "api"
        Title = "MW-API [Port 4000]"
        Path = "apps\api"
        Port = 4000
        Runner = "dev-api.cmd"
        Description = "API Backend"
        Url = "http://localhost:4000"
    },
    @{
        Id = "command-center"
        Title = "MW-COMMAND-CENTER [Port 3001]"
        Path = "apps\command-center"
        Port = 3001
        Runner = "dev-command-center.cmd"
        Description = "Command Center"
        Url = "http://localhost:3001"
    },
    @{
        Id = "web"
        Title = "MW-WEB [Port 3000]"
        Path = "apps\web"
        Port = 3000
        Runner = "dev-web.cmd"
        Description = "Public Web Portal"
        Url = "http://localhost:3000"
    }
)

if (-not $NoPython) {
    $services += @(
        @{
            Id = "celestial"
            Title = "MW-CELESTIAL [Port 8001]"
            Path = "services\celestial-engine"
            Port = 8001
            Runner = "dev-celestial.cmd"
            Description = "Celestial Engine"
            Url = "http://localhost:8001"
        },
        @{
            Id = "ai-agent"
            Title = "MW-AI-AGENT [Port 8002]"
            Path = "services\ai-agent"
            Port = 8002
            Runner = "dev-ai-agent.cmd"
            Description = "AI Agent Service"
            Url = "http://localhost:8002"
        }
    )
}

# 2. Port Check and Automatic Cleanup
Write-Host "`n>> Step 1/3: Checking local port availability..." -ForegroundColor Yellow
foreach ($svc in $services) {
    $connections = Get-NetTCPConnection -LocalPort $svc.Port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        Write-Host "  [!] Port $($svc.Port) ($($svc.Description)) is currently in use by PID: $($pids -join ', ')" -ForegroundColor Yellow
        if (-not $KeepExisting) {
            foreach ($procId in $pids) {
                try {
                    $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
                    $procName = if ($proc) { $proc.ProcessName } else { "Unknown" }
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                    Write-Host "      [OK] Cleaned previous process PID $procId ($procName) on port $($svc.Port)" -ForegroundColor Green
                } catch {
                    Write-Host "      [ERR] Could not terminate PID $procId" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "      Keeping existing process because -KeepExisting was specified." -ForegroundColor DarkGray
        }
    } else {
        Write-Host "  [OK] Port $($svc.Port) is free for $($svc.Description)." -ForegroundColor DarkGray
    }
}

# 3. Build Shared Workspace Packages (@moon/*)
Write-Host "`n>> Step 2/3: Building shared workspace packages (@moon/*)..." -ForegroundColor Yellow
Push-Location $RepoRoot
try {
    & pnpm --filter "@moon/*" build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [!] Shared package build returned code $LASTEXITCODE, proceeding with dev..." -ForegroundColor Yellow
    } else {
        Write-Host "  [OK] Shared packages verified and up-to-date." -ForegroundColor Green
    }
} finally {
    Pop-Location
}

# Ensure Python Virtualenv is synced if needed
$venvActivateBat = Join-Path $RepoRoot ".venv\Scripts\activate.bat"
if ((-not $NoPython) -and (-not (Test-Path $venvActivateBat))) {
    Write-Host "  [*] Synchronizing Python virtual environment (.venv)..." -ForegroundColor Cyan
    try {
        & python -m uv sync --directory "$RepoRoot\services\celestial-engine"
        & python -m uv pip install --python "$RepoRoot\.venv" -e "$RepoRoot\services\ai-agent"
        Write-Host "  [OK] Python dependencies verified." -ForegroundColor Green
    } catch {
        Write-Host "  [!] Python sync returned warning, proceeding with startup..." -ForegroundColor Yellow
    }
}

# 4. Launch Services Based on Mode
Write-Host "`n>> Step 3/3: Launching services using [$Mode] mode..." -ForegroundColor Yellow

if ($Mode -eq "cmd") {
    # Default: Dedicated Windows CMD console window for each service via start command
    Write-Host "[+] Launching dedicated Windows CMD window for each service..." -ForegroundColor Cyan

    foreach ($svc in $services) {
        $runnerFile = Join-Path $RepoRoot "scripts\runners\$($svc.Runner)"
        Start-Process "cmd.exe" -ArgumentList "/c", "start", "`"$($svc.Title)`"", "`"$runnerFile`""
        Write-Host "  [OK] Started CMD window: $($svc.Title)" -ForegroundColor Green
        Start-Sleep -Milliseconds 400
    }

} elseif ($Mode -eq "wt") {
    # Windows Terminal: Each in a new window or tabs
    Write-Host "[+] Launching services in Windows Terminal..." -ForegroundColor Cyan

    foreach ($svc in $services) {
        $runnerFile = Join-Path $RepoRoot "scripts\runners\$($svc.Runner)"
        Start-Process "wt.exe" -ArgumentList "-w", "new", "--title", $svc.Title, "cmd.exe", "/c", "`"$runnerFile`""
        Write-Host "  [OK] Started WT window: $($svc.Title)" -ForegroundColor Green
        Start-Sleep -Milliseconds 400
    }

} elseif ($Mode -eq "powershell") {
    # Separate PowerShell console windows
    Write-Host "[+] Launching separate PowerShell console windows..." -ForegroundColor Cyan

    foreach ($svc in $services) {
        $svcDir = (Resolve-Path (Join-Path $RepoRoot $svc.Path)).Path
        $psCmd = "Set-Location `"$svcDir`"; `$host.UI.RawUI.WindowTitle = '$($svc.Title)'; Write-Host 'Starting $($svc.Description)...' -ForegroundColor Cyan; pnpm dev"
        Start-Process "powershell.exe" -ArgumentList "-NoExit", "-Command", $psCmd -WorkingDirectory $svcDir
        Write-Host "  [OK] Started PowerShell window: $($svc.Title)" -ForegroundColor Green
        Start-Sleep -Milliseconds 400
    }

} else {
    # Turbo parallel mode in current console
    Write-Host "[+] Running services in parallel via Turbo in current terminal..." -ForegroundColor Cyan
    Push-Location $RepoRoot
    try {
        & pnpm dev
    } finally {
        Pop-Location
    }
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "ALL MOONWITNESS SERVICES ACTIVE:" -ForegroundColor Cyan
foreach ($svc in $services) {
    Write-Host "  * $($svc.Description.PadRight(18)) : $($svc.Url) ($($svc.Path))" -ForegroundColor White
}
Write-Host "`nNote: Each service is running in its own dedicated Windows CMD window." -ForegroundColor Gray
Write-Host "To stop all services and free ports, run: pnpm win:dev:down" -ForegroundColor DarkGray
Write-Host "=================================================================" -ForegroundColor Cyan
