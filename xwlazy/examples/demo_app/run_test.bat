@echo off
REM Simple test script to run the demo
REM This ensures xwlazy is installed and runs the demo

echo ================================================
echo xwlazy v4.0 Demo App - Auto-Installation Test
echo ================================================
echo.

REM Store the script's directory (demo_app folder)
set SCRIPT_DIR=%~dp0
REM Change to xwlazy root (2 levels up from demo_app)
set XWLAZY_ROOT=%SCRIPT_DIR%..\..

REM Check if xwlazy is installed
python -c "import exonware.xwlazy" 2>nul
if errorlevel 1 (
    echo Installing xwlazy...
    cd /d "%XWLAZY_ROOT%"
    pip install -e . >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Failed to install xwlazy!
        echo Please install manually: pip install -e "%XWLAZY_ROOT%"
        pause
        exit /b 1
    )
    echo xwlazy installed successfully!
    cd /d "%SCRIPT_DIR%"
)

echo Running demo...
echo.
cd /d "%SCRIPT_DIR%"
python demo.py

pause
