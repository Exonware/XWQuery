# eXonware CI Tools

This directory contains batch scripts for common development tasks in the xwui project.

## Available Scripts

### `commands.bat`
Main command dispatcher that calls the shared eXonware CI Python tools.

**Usage:**
```batch
commands.bat <command> [args...]
```

**Examples:**
```batch
REM Show help
commands.bat help

REM Upload a project
commands.bat upload_auto xwsystem

REM Install a package
commands.bat install xwsystem[full][dev]

REM Setup Python
commands.bat setup_python
```

**Available Commands:**
- `help` - Show command list or detailed help
- `upload_auto` - Auto bump version and upload project
- `upload_all` - Upload all eXonware projects
- `install` - Install package from PyPI or editable mode
- `install_dev` - Install local editable copy
- `uninstall` - Remove package locally
- `setup_python` - Ensure Python is installed and configured
- `add_pip_to_path` - Add Python and pip to PATH
- `version` - Version maintenance toolkit
- `quick_release` - Quick release workflows
- `publish` - Simple publisher (git + PyPI)
- And more...

See `commands.bat help` for the full list.

### `start_server.bat`
Starts the Vite development server.

**Usage:**
```batch
start_server.bat
```

This will:
1. Navigate to the project root
2. Check for dependencies
3. Start the Vite dev server on port 3000

### `build.bat`
Builds the project for production using Vite.

**Usage:**
```batch
build.bat
```

This will:
1. Navigate to the project root
2. Check for dependencies
3. Build the project to the `dist/` directory

## Requirements

- **Node.js and npm** - For Vite server and build commands
- **Python** - For CI commands (will be checked/installed via `setup_python`)
- **eXonware CI Tools** - Located at `d:\OneDrive\DEV\exonware\tools\ci\python_scripts`

## Setup

1. Ensure Python is installed and configured:
   ```batch
   commands.bat setup_python
   ```

2. Install Node.js dependencies:
   ```batch
   npm install
   ```

3. Start developing:
   ```batch
   start_server.bat
   ```

## Notes

- All scripts use relative paths from the project root
- The `commands.bat` script calls the shared CI tools from the eXonware tools directory
- Make sure the CI tools directory exists at the configured path

