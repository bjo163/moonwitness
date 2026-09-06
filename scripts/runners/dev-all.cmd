@echo off
echo =================================================================
echo   MOONWITNESS OS - LAUNCHING ALL 3 SERVICES (STANDALONE CMD)
echo =================================================================
start "MW-API [Port 4000]" "%~dp0dev-api.cmd"
start "MW-COMMAND-CENTER [Port 3001]" "%~dp0dev-command-center.cmd"
start "MW-WEB [Port 3000]" "%~dp0dev-web.cmd"
echo All 3 services spawned in separate windows.
