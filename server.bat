@echo off
REM ============================================================================
REM What an AI - Local Development Server Launcher (Windows)
REM -----------------------------------------------
REM This script automatically detects and launches the best available local server.
REM Simply double-click or run: server.bat
REM REM
REM REM You can also specify a port: server.bat 3000
REM ============================================================================

setlocal enabledelayedexpansion

set "PORT=%1"
if "%PORT%"=="" set "PORT=8080"

set "DIRECTORY=%~dp0"

echo ========================================================
echo What an AI - Local Server Launcherecho ========================================================
echo.
echo Checking for available server options...
echo.

REM Function to check if command exists (approximate)
where python >nul 2>&1
set "PYTHON_AVAILABLE=!errorlevel!"

where python3 >nul 2>&1
set "PYTHON3_AVAILABLE=!errorlevel!"

where node >nul 2>&1
set "NODE_AVAILABLE=!errorlevel!"

REM Try Python first (recommended)
if !PYTHON3_AVAILABLE! equ 0 (
    echo [Python 3 detected, starting Python server...
    echo.
    cd "%DIRECTORY%"
    python3 server.py %PORT%
    goto :eof
)

if !PYTHON_AVAILABLE! equ 0 (
    echo [Python detected, starting Python server...
    echo.
    cd "%DIRECTORY%"
    python server.py %PORT%
    goto :eof
)

REM Fallback to Node.js
if !NODE_AVAILABLE! equ 0 (
    echo [Node.js detected, starting Node.js server...
    echo.
    cd "%DIRECTORY%"
    node server.js %PORT%
    goto :eof
)

REM No server runtime available
echo Error: Neither Python nor Node.js found on your system.
echo.
echo Please install one of the following:
echo.
echo Option 1 - Python (Recommended):
echo   Download from: https://python.org
echo   Make sure to check "Add Python to PATH" during installation
echo.
echo Option 2 - Node.js:
echo   Download from: https://nodejs.org
echo.
echo Then run this script again.
echo.
echo Press any key to exit...
pause >nul
exit /b 1
