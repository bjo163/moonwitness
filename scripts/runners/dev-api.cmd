@echo off
title MW-API [Port 4000]
cd /d "%~dp0..\..\apps\api"
echo =================================================================
echo   MOONWITNESS OS - API BACKEND [http://localhost:4000]
echo =================================================================
call pnpm.cmd dev
if errorlevel 1 pause
