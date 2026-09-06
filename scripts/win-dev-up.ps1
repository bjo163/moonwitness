# MOONWITNESS OS - WINDOWS MULTI-SERVICE DEV RUNNER
param(
    [ValidateSet("cmd", "wt", "powershell", "turbo")]
    [string]$Mode = "cmd",
    [switch]$WithPython,
    [switch]$KeepExisting
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "MOONWITNESS OS - WINDOWS MULTI-SERVICE DEV RUNNER" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Workspace Root: $RepoRoot" -ForegroundColor DarkGray
Write-Host "Execution Mode: $Mode (Dedicated Windows CMD per service)" -ForegroundColor DarkGray

# 1. Service Definitions
$services = @(
    @{
        Id = "api"
        Title = "MW-API [Port 4000]"
        Path = "apps\api"
        Port = 4000
        Command = "pnpm dev"
        Description = "API Backend"
        Url = "http://localhost:4000"
    },
    @{
        Id = "command-center"
        Title = "MW-COMMAND-CENTER [Port 3001]"
        Path = "apps\command-center"
        Port = 3001
        Command = "pnpm dev"
        Description = "Command Center"
        Url = "http://localhost:3001"
    },
    @{
        Id = "web"
        Title = "MW-WEB [Port 3000]"
        Path = "apps\web"
        Port = 3000
        Command = "pnpm dev"
        Description = "Public Web Portal"
        Url = "http://localhost:3000"
    }
)

if ($WithPython) {
    $services += @{
        Id = "celestial"
        Title = "MW-CELESTIAL [Port 8001]"
        Path = "services\celestial-engine"
        Port = 8001
        Command = "python -m uvicorn src.main:app --port 8001 --reload"
        Description = "Celestial Engine"
        Url = "http://localhost:8001"
    }
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

# 3. Build Shared Packages (@moon/*)
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

# 4. Launch Services Based on Mode
Write-Host "`n>> Step 3/3: Launching services using [$Mode] mode..." -ForegroundColor Yellow

if ($Mode -eq "cmd") {
    # Default: Separate Windows CMD console window for each service
    Write-Host "[+] Launching dedicated Windows CMD window for each service..." -ForegroundColor Cyan

    foreach ($svc in $services) {
        $svcDir = (Resolve-Path (Join-Path $RepoRoot $svc.Path)).Path
        Start-Process "cmd.exe" -ArgumentList "/k", "title $($svc.Title) & $($svc.Command)" -WorkingDirectory $svcDir
        Write-Host "  [OK] Started CMD window: $($svc.Title)" -ForegroundColor Green
    }

} elseif ($Mode -eq "powershell") {
    # Separate PowerShell console windows
    Write-Host "[+] Launching separate PowerShell console windows..." -ForegroundColor Cyan

    foreach ($svc in $services) {
        $svcDir = (Resolve-Path (Join-Path $RepoRoot $svc.Path)).Path
        $psCmd = "`$host.UI.RawUI.WindowTitle = '$($svc.Title)'; Write-Host 'Starting $($svc.Description)...' -ForegroundColor Cyan; $($svc.Command)"
        Start-Process "powershell.exe" -ArgumentList "-NoExit", "-Command", $psCmd -WorkingDirectory $svcDir
        Write-Host "  [OK] Started PowerShell window: $($svc.Title)" -ForegroundColor Green
    }

} elseif ($Mode -eq "wt") {
    # Windows Terminal tabbed session
    Write-Host "[+] Launching services in Windows Terminal tabbed session..." -ForegroundColor Cyan

    $ApiDir = (Resolve-Path (Join-Path $RepoRoot "apps\api")).Path
    $CcDir = (Resolve-Path (Join-Path $RepoRoot "apps\command-center")).Path
    $WebDir = (Resolve-Path (Join-Path $RepoRoot "apps\web")).Path

    $wtArgs = @(
        "-w", "0",
        "new-tab", "--title", "MW-API [4000]", "-d", $ApiDir, "cmd.exe", "/k", "pnpm dev",
        ";",
        "new-tab", "--title", "MW-COMMAND-CENTER [3001]", "-d", $CcDir, "cmd.exe", "/k", "pnpm dev",
        ";",
        "new-tab", "--title", "MW-WEB [3000]", "-d", $WebDir, "cmd.exe", "/k", "pnpm dev"
    )

    if ($WithPython) {
        $PythonDir = (Resolve-Path (Join-Path $RepoRoot "services\celestial-engine")).Path
        $wtArgs += @(
            ";",
            "new-tab", "--title", "MW-CELESTIAL [8001]", "-d", $PythonDir, "cmd.exe", "/k", "python -m uvicorn src.main:app --port 8001 --reload"
        )
    }

    Start-Process "wt.exe" -ArgumentList $wtArgs
    Write-Host "  [OK] Windows Terminal opened with dedicated service tabs." -ForegroundColor Green

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
Write-Host "SERVICES LAUNCHED SUCCESSFULLY:" -ForegroundColor Cyan
foreach ($svc in $services) {
    Write-Host "  * $($svc.Description.PadRight(18)) : $($svc.Url) ($($svc.Path))" -ForegroundColor White
}
Write-Host "`nNote: Each service is running in its own dedicated Windows CMD window." -ForegroundColor Gray
Write-Host "To stop all services and free ports, run: pnpm win:dev:down" -ForegroundColor DarkGray
Write-Host "=================================================================" -ForegroundColor Cyan
