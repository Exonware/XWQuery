@echo off
REM eXonware CI Commands Wrapper
REM Calls Python commands.py from the shared CI tools directory
REM
REM Usage: commands.bat <command> [args...]
REM Example: commands.bat help
REM Example: commands.bat upload_auto xwsystem
REM Example: commands.bat install xwsystem[full][dev]

setlocal enabledelayedexpansion

REM Path to the shared CI Python scripts directory
set "CI_SCRIPTS_DIR=d:\OneDrive\DEV\exonware\tools\ci\python_scripts"

REM Check if the scripts directory exists
if not exist "%CI_SCRIPTS_DIR%" (
    echo ERROR: CI scripts directory not found: %CI_SCRIPTS_DIR%
    echo Please ensure the eXonware CI tools are installed.
    exit /b 1
)

REM Find Python executable
set "PYTHON_CMD="
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "PYTHON_CMD=python"
) else (
    where python3 >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set "PYTHON_CMD=python3"
    ) else (
        echo ERROR: Python not found in PATH.
        echo Please install Python or add it to your PATH.
        echo You can run: commands.bat setup_python
        exit /b 1
    )
)

REM Change to the scripts directory and run commands.py
cd /d "%CI_SCRIPTS_DIR%"

REM Pass all arguments to commands.py
"%PYTHON_CMD%" commands.py %*

REM Preserve exit code
set "EXIT_CODE=%ERRORLEVEL%"
endlocal
exit /b %EXIT_CODE%

