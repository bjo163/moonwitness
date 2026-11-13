@echo off
title MW-COMMAND-CENTER [Port 3001]
cd /d "%~dp0..\..\apps\command-center"
echo =================================================================
echo   MOONWITNESS OS - COMMAND CENTER [http://localhost:3001]
echo =================================================================
call pnpm.cmd dev
if errorlevel 1 pause
