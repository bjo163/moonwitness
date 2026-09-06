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

# 1. Resolve Python Runner
$venvActivateBat = Join-Path $RepoRoot ".venv\Scripts\activate.bat"
$venvActivatePs1 = Join-Path $RepoRoot ".venv\Scripts\Activate.ps1"
$hasVenv = (Test-Path $venvActivateBat)

$celestialCmdBat = if ($hasVenv) {
    "call $venvActivateBat & uvicorn src.main:app --port 8001 --reload"
} else {
    "python -m uv run uvicorn src.main:app --port 8001 --reload"
}

$celestialCmdPs = if (Test-Path $venvActivatePs1) {
    "& '$venvActivatePs1'; uvicorn src.main:app --port 8001 --reload"
} else {
    "python -m uv run uvicorn src.main:app --port 8001 --reload"
}

$aiAgentCmdBat = if ($hasVenv) {
    "call $venvActivateBat & uvicorn src.main:app --port 8002 --reload"
} else {
    "python -m uv run uvicorn src.main:app --port 8002 --reload"
}

$aiAgentCmdPs = if (Test-Path $venvActivatePs1) {
    "& '$venvActivatePs1'; uvicorn src.main:app --port 8002 --reload"
} else {
    "python -m uv run uvicorn src.main:app --port 8002 --reload"
}

# 2. Service Definitions (All 5 Polyglot Services)
$services = @(
    @{
        Id = "api"
        Title = "MW-API [Port 4000]"
        Path = "apps\api"
        Port = 4000
        CmdCommand = "pnpm dev"
        PsCommand = "pnpm dev"
        Description = "API Backend"
        Url = "http://localhost:4000"
    },
    @{
        Id = "command-center"
        Title = "MW-COMMAND-CENTER [Port 3001]"
        Path = "apps\command-center"
        Port = 3001
        CmdCommand = "pnpm dev"
        PsCommand = "pnpm dev"
        Description = "Command Center"
        Url = "http://localhost:3001"
    },
    @{
        Id = "web"
        Title = "MW-WEB [Port 3000]"
        Path = "apps\web"
        Port = 3000
        CmdCommand = "pnpm dev"
        PsCommand = "pnpm dev"
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
            CmdCommand = $celestialCmdBat
            PsCommand = $celestialCmdPs
            Description = "Celestial Engine"
            Url = "http://localhost:8001"
        },
        @{
            Id = "ai-agent"
            Title = "MW-AI-AGENT [Port 8002]"
            Path = "services\ai-agent"
            Port = 8002
            CmdCommand = $aiAgentCmdBat
            PsCommand = $aiAgentCmdPs
            Description = "AI Agent Service"
            Url = "http://localhost:8002"
        }
    )
}

# 3. Port Check and Automatic Cleanup
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

# 4. Build Shared Workspace Packages (@moon/*)
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
if ((-not $NoPython) -and (-not $hasVenv)) {
    Write-Host "  [*] Synchronizing Python virtual environment (.venv)..." -ForegroundColor Cyan
    try {
        & python -m uv sync --directory "$RepoRoot\services\celestial-engine"
        & python -m uv pip install --python "$RepoRoot\.venv" -e "$RepoRoot\services\ai-agent"
        Write-Host "  [OK] Python dependencies verified." -ForegroundColor Green
    } catch {
        Write-Host "  [!] Python sync returned warning, proceeding with startup..." -ForegroundColor Yellow
    }
}

# 5. Launch Services Based on Mode
Write-Host "`n>> Step 3/3: Launching services using [$Mode] mode..." -ForegroundColor Yellow

if ($Mode -eq "cmd") {
    # Default: Dedicated Windows CMD console window for each service
    Write-Host "[+] Launching dedicated Windows CMD window for each service..." -ForegroundColor Cyan

    foreach ($svc in $services) {
        $svcDir = (Resolve-Path (Join-Path $RepoRoot $svc.Path)).Path
        Start-Process "cmd.exe" -ArgumentList "/k", "title $($svc.Title) & cd /d $svcDir & $($svc.CmdCommand)" -WorkingDirectory $svcDir
        Write-Host "  [OK] Started CMD window: $($svc.Title)" -ForegroundColor Green
        Start-Sleep -Milliseconds 400
    }

} elseif ($Mode -eq "powershell") {
    # Separate PowerShell console windows
    Write-Host "[+] Launching separate PowerShell console windows..." -ForegroundColor Cyan

    foreach ($svc in $services) {
        $svcDir = (Resolve-Path (Join-Path $RepoRoot $svc.Path)).Path
        $psCmd = "Set-Location `"$svcDir`"; `$host.UI.RawUI.WindowTitle = '$($svc.Title)'; Write-Host 'Starting $($svc.Description)...' -ForegroundColor Cyan; $($svc.PsCommand)"
        Start-Process "powershell.exe" -ArgumentList "-NoExit", "-Command", $psCmd -WorkingDirectory $svcDir
        Write-Host "  [OK] Started PowerShell window: $($svc.Title)" -ForegroundColor Green
        Start-Sleep -Milliseconds 400
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

    if (-not $NoPython) {
        $CelestialDir = (Resolve-Path (Join-Path $RepoRoot "services\celestial-engine")).Path
        $AiAgentDir = (Resolve-Path (Join-Path $RepoRoot "services\ai-agent")).Path

        $wtArgs += @(
            ";",
            "new-tab", "--title", "MW-CELESTIAL [8001]", "-d", $CelestialDir, "cmd.exe", "/k", $celestialCmdBat,
            ";",
            "new-tab", "--title", "MW-AI-AGENT [8002]", "-d", $AiAgentDir, "cmd.exe", "/k", $aiAgentCmdBat
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
Write-Host "ALL MOONWITNESS SERVICES ACTIVE:" -ForegroundColor Cyan
foreach ($svc in $services) {
    Write-Host "  * $($svc.Description.PadRight(18)) : $($svc.Url) ($($svc.Path))" -ForegroundColor White
}
Write-Host "`nNote: Each service is running in its own dedicated Windows CMD window." -ForegroundColor Gray
Write-Host "To stop all services and free ports, run: pnpm win:dev:down" -ForegroundColor DarkGray
Write-Host "=================================================================" -ForegroundColor Cyan
