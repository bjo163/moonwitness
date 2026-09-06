@echo off
echo =================================================================
echo   MOONWITNESS OS - LAUNCHING ALL 5 SERVICES (STANDALONE CMD)
echo =================================================================
start "MW-API [Port 4000]" "%~dp0dev-api.cmd"
start "MW-COMMAND-CENTER [Port 3001]" "%~dp0dev-command-center.cmd"
start "MW-WEB [Port 3000]" "%~dp0dev-web.cmd"
start "MW-CELESTIAL [Port 8001]" "%~dp0dev-celestial.cmd"
start "MW-AI-AGENT [Port 8002]" "%~dp0dev-ai-agent.cmd"
echo All 5 services spawned in separate windows.
