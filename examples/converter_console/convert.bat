@echo off
REM XWQuery Converter Console - Windows Batch Wrapper
REM Usage: convert <from_format> <to_format> <input_file> <output_file>
REM Example: convert xwqs sql input.xwqs output.sql

python "%~dp0converter_console.py" convert %*
