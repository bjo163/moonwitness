@echo off
title MW-CELESTIAL [Port 8001]
cd /d "%~dp0..\..\services\celestial-engine"
echo =================================================================
echo   MOONWITNESS OS - CELESTIAL ENGINE [http://localhost:8001]
echo =================================================================
if exist "%~dp0..\..\.venv\Scripts\activate.bat" (
    call "%~dp0..\..\.venv\Scripts\activate.bat"
    uvicorn src.main:app --port 8001 --reload
) else (
    python -m uv run uvicorn src.main:app --port 8001 --reload
)
if errorlevel 1 pause
