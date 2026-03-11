# Converter Console - Copy-Paste Commands

Ready-to-use commands for the XWQuery Converter Console.

## Quick Start

Navigate to the converter console directory first:
```powershell
cd d:\OneDrive\DEV\exonware\xwquery\examples\converter_console
```

## Basic Conversions

### XWQuery Script to SQL
```powershell
python converter_console.py convert xwqs sql files\input.xwqs files\output.sql
```

### SQL to XWQuery Script
```powershell
python converter_console.py convert sql xwqs files\input.sql files\output.xwqs
```

### SQL to GraphQL
```powershell
python converter_console.py convert sql graphql files\input.sql files\output.graphql
```

### Cypher to SQL
```powershell
python converter_console.py convert cypher sql files\input.cypher files\output.sql
```

### SQL to MongoDB
```powershell
python converter_console.py convert sql mongodb files\input.sql files\output.mongodb
```

## Using the Batch File (Windows)

### XWQuery Script to SQL
```powershell
.\convert.bat xwqs sql files\input.xwqs files\output.sql
```

### SQL to XWQuery Script
```powershell
.\convert.bat sql xwqs files\input.sql files\output.xwqs
```

## Advanced Examples

### Create Test Input Files

Create a SQL file:
```powershell
@"
SELECT name, age, email
FROM users
WHERE age > 25
ORDER BY name ASC
LIMIT 10;
"@ | Out-File -FilePath files\test.sql -Encoding utf8
```

Create an XWQuery Script file:
```powershell
@"
-- XWQuery Script Example
SELECT name, age, email
FROM users
WHERE age > 25
ORDER BY name ASC
LIMIT 10;
"@ | Out-File -FilePath files\test.xwqs -Encoding utf8
```

### Run Conversions

Convert SQL to XWQuery Script:
```powershell
python converter_console.py convert sql xwqs files\test.sql files\test_output.xwqs
```

Convert XWQuery Script to SQL:
```powershell
python converter_console.py convert xwqs sql files\test.xwqs files\test_output.sql
```

Convert SQL to Cypher:
```powershell
python converter_console.py convert sql cypher files\test.sql files\test_output.cypher
```

Convert SQL to GraphQL:
```powershell
python converter_console.py convert sql graphql files\test.sql files\test_output.graphql
```

## Format Aliases

The following aliases are supported:
- `xwqs` → `xwquery`
- `xwqueryscript` → `xwquery`
- `xwquery_script` → `xwquery`

## Supported Formats

### SQL Family
- `sql`, `sqlite`, `mysql`, `postgresql`
- `n1ql`, `partiql`, `cql`
- `hiveql`, `hql`, `kql`

### Graph Query Languages
- `cypher`, `opencypher`, `gsql`, `ngql`
- `gremlin`, `sparql`, `gql`

### Document/JSON Query Languages
- `mongodb`, `couchdb`
- `jmespath`, `jq`, `jsoniq`
- `jsonpath`, `jsonata`

### API Query Languages
- `graphql`

### Time-Series Query Languages
- `promql`, `logql`, `flux`, `eql`

### Processing/ETL
- `datalog`, `linq`, `pig`

### Specialized
- `xwquery` (or `xwqs`) - XWQuery Script format

## Complete Test Workflow

```powershell
# Navigate to converter console
cd d:\OneDrive\DEV\exonware\xwquery\examples\converter_console

# Create test SQL file
@"
SELECT name, age, email
FROM users
WHERE age > 25 AND active = true
ORDER BY name ASC
LIMIT 10;
"@ | Out-File -FilePath files\my_query.sql -Encoding utf8

# Convert SQL to XWQuery Script
python converter_console.py convert sql xwqs files\my_query.sql files\my_query.xwqs

# Convert XWQuery Script back to SQL
python converter_console.py convert xwqs sql files\my_query.xwqs files\my_query_back.sql

# View the results
Get-Content files\my_query.sql
Get-Content files\my_query.xwqs
Get-Content files\my_query_back.sql
```

## Error Handling

If you get an error about missing files:
```powershell
# Make sure the files directory exists
New-Item -ItemType Directory -Force -Path files
```

If you get encoding errors:
```powershell
# Files are automatically created with UTF-8 encoding
# Make sure your input files are UTF-8 encoded
```

## Tips

1. **Format names are case-insensitive** - `SQL`, `sql`, and `Sql` all work
2. **Use relative paths** - Files are relative to where you run the command
3. **Output directories are created automatically** - You don't need to create them first
4. **Check the output** - Always verify the converted files look correct
