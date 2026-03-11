# Converter Console Test Files

This directory contains test input and output files for the XWQuery Converter Console.

## Test Files

### Input Files

- **input.xwqs** - XWQuery Script example with SELECT query
- **input.sql** - SQL example with SELECT query

### Output Files

- **output.sql** - Generated SQL from XWQuery Script conversion
- **output.xwqs** - Generated XWQuery Script from SQL conversion

## Test Commands

### XWQuery Script to SQL
```bash
cd examples/converter_console
python converter_console.py convert xwqs sql files/input.xwqs files/output.sql
```

### SQL to XWQuery Script
```bash
cd examples/converter_console
python converter_console.py convert sql xwqs files/input.sql files/output.xwqs
```

## Test Results

✅ **XWQuery Script → SQL**: Conversion successful
✅ **SQL → XWQuery Script**: Conversion successful

Both conversions completed without errors and generated output files in the `files/` directory.
