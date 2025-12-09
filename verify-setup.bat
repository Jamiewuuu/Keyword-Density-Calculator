@echo off
REM ============================================================================
REM What an AI - Setup Verification Script (Windows)
REM REM This script checks if your system is ready to run the tools locally.
REM ============================================================================

echo =========================================================
echo What an AI - Setup Verification
echo =========================================================
echo.

set PYTHON_AVAILABLE=0
set NODE_AVAILABLE=0

REM Check Python
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python found
    set PYTHON_AVAILABLE=1
) else (
    echo [X] Python not found
)

REM Check Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js found
    set NODE_AVAILABLE=1
) else (
    echo [X] Node.js not found
)

REM Check files
echo.
echo Checking files...
echo.

if exist "index.html" (
    echo [OK] index.html exists
) else (
    echo [X] index.html not found
)

if exist "keyword-density.html" (
    echo [OK] keyword-density.html exists
) else (
    echo [X] keyword-density.html not found
)

if exist "data.json" (
    echo [OK] data.json exists
) else (
    echo [X] data.json not found
)

if exist "server.py" (
    echo [OK] server.py exists
) else (
    echo [X] server.py not found
)

if exist "server.bat" (
    echo [OK] server.bat exists
) else (
    echo [X] server.bat not found
)

REM Summary
echo.
echo =========================================================
echo Summary
echo =========================================================
echo.

if %PYTHON_AVAILABLE% equ 1 (
    echo [OK] Your system is ready!
    echo.
    echo You can start the server with:
    echo.
    echo   .
ame server.bat
    echo   or: python server.py
    echo.
    echo Or just double-click keyword-density.html!
) else if %NODE_AVAILABLE% equ 1 (
    echo [OK] Your system is ready!
    echo.
    echo You can start the server with:
    echo.
    echo   node server.js
    echo.
    echo Or just double-click keyword-density.html!
) else (
    echo [X] No server runtime found
    echo.
    echo Please install Python 3 or Node.js:
    echo   - Python: https://python.org
    echo   - Node.js: https://nodejs.org
)

echo.
echo For detailed instructions, see:
echo   - START-HERE.txt (quick start)
echo   - RUN-LOCAL.md (detailed guide)
echo.

echo Press any key to exit...
pause >nul
