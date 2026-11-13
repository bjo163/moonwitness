@echo off
title MW-AI-AGENT [Port 8002]
cd /d "%~dp0..\..\services\ai-agent"
echo =================================================================
echo   MOONWITNESS OS - AI AGENT SERVICE [http://localhost:8002]
echo =================================================================
if exist "%~dp0..\..\.venv\Scripts\activate.bat" (
    call "%~dp0..\..\.venv\Scripts\activate.bat"
    uvicorn src.main:app --port 8002 --reload
) else (
    python -m uv run uvicorn src.main:app --port 8002 --reload
)
if errorlevel 1 pause
