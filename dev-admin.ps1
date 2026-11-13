$ErrorActionPreference = "Stop"
$env:NODE_OPTIONS = "--max-old-space-size=4096"
Set-Location -Path (Split-Path -Parent $PSScriptRoot)
pnpm dev:admin
