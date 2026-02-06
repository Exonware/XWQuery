@echo off
REM Start Vite Development Server
REM This script starts the Vite dev server for the xwui project

setlocal

echo ========================================
echo Starting Vite Development Server
echo ========================================
echo.

REM Get the project root (parent of tools/ci)
set "PROJECT_ROOT=%~dp0..\.."
cd /d "%PROJECT_ROOT%"

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: node_modules not found. Please run 'npm install' first.
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found in project root.
    exit /b 1
)

REM Check if npm is available
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found in PATH.
    echo Please install Node.js and npm.
    exit /b 1
)

REM Start Vite dev server
echo Starting server...
echo.
npm run dev

endlocal

