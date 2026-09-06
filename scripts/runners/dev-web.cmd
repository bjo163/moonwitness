@echo off
title MW-WEB [Port 3000]
cd /d "%~dp0..\..\apps\web"
echo =================================================================
echo   MOONWITNESS OS - PUBLIC WEB PORTAL [http://localhost:3000]
echo =================================================================
call pnpm.cmd dev
if errorlevel 1 pause
