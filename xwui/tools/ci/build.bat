@echo off
REM Build the project using Vite
REM This script builds the project for production
REM 
REM Company: eXonware.com
REM Based on: GUIDE_TEST.md - Windows UTF-8 Configuration

setlocal EnableDelayedExpansion

REM ⚠️ CRITICAL: Configure UTF-8 encoding for Windows console (GUIDE_TEST.md compliance)
REM This ensures proper display of Unicode characters and prevents encoding errors
chcp 65001 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to set UTF-8 code page. Continuing with default encoding.
)

echo ========================================
echo Building Project with Vite
echo ========================================
echo.

REM Get the project root (parent of tools/ci)
set "PROJECT_ROOT=%~dp0..\.."
cd /d "%PROJECT_ROOT%"

REM Display full absolute path (GUIDE_TEST.md - always show full paths)
echo Project Root: %CD%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo ========================================
    echo ❌ ERROR: node_modules not found
    echo ========================================
    echo Please run 'npm install' first.
    echo.
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo.
    echo ========================================
    echo ❌ ERROR: package.json not found
    echo ========================================
    echo Expected location: %CD%\package.json
    echo.
    exit /b 1
)

REM Check if npm is available
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo ❌ ERROR: npm not found in PATH
    echo ========================================
    echo Please install Node.js and npm.
    echo Download from: https://nodejs.org/
    echo.
    exit /b 1
)

REM Build the project
echo ========================================
echo 🚀 Starting build process...
echo ========================================
echo.

REM Configure PowerShell for UTF-8 output (GUIDE_TEST.md compliance)
REM Run npm command with proper encoding and error handling
REM Using PowerShell with UTF-8 encoding to ensure proper character display
powershell -ExecutionPolicy Bypass -NoProfile -Command "& { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8; $env:npm_config_update_notifier='false'; $env:CI='true'; $ErrorActionPreference = 'Stop'; Write-Host 'Running: npm run build:vite' -ForegroundColor Cyan; npm run build:vite; if ($LASTEXITCODE -ne 0) { Write-Host 'Build failed with exit code:' $LASTEXITCODE -ForegroundColor Red; exit $LASTEXITCODE } }"
set BUILD_EXIT_CODE=%ERRORLEVEL%

echo.

if %BUILD_EXIT_CODE% EQU 0 (
    echo ========================================
    echo ✅ Build completed successfully!
    echo ========================================
    echo.
    echo Build output location: %CD%\dist
    echo.
) else (
    echo ========================================
    echo ❌ Build failed!
    echo ========================================
    echo.
    echo Exit code: %BUILD_EXIT_CODE%
    echo.
    echo Please check the error messages above for details.
    echo.
    exit /b %BUILD_EXIT_CODE%
)

endlocal

