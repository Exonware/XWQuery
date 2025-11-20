# Query Generation Templates

This directory contains template files for all 31 supported query formats.

## Template Structure

```
templates/
├── sql/
│   ├── select.template
│   ├── insert.template
│   ├── update.template
│   └── delete.template
├── cypher/
│   ├── match.template
│   ├── create.template
│   └── return.template
├── graphql/
│   ├── query.template
│   └── mutation.template
└── ... (29 more format directories)
```

## Template Syntax

Templates use Mustache-like syntax:

### Parameter Substitution
```
{{variable}}
{{object.property}}
```

### Conditionals
```
{{#if condition}}
  content if true
{{else}}
  content if false
{{/if}}
```

### Loops
```
{{#each items}}
  {{@item}} at index {{@index}}
{{/each}}
```

### Filters
```
{{variable|upper}}
{{variable|sql_escape}}
{{items|comma_list}}
```

### Partials (Nested Templates)
```
{{>partial_name}}
```

## SQL SELECT Example

File: `sql/select.template`

```sql
SELECT {{#if distinct}}DISTINCT {{/if}}{{columns|comma_list}}
FROM {{table_name|identifier}}
{{#if where}}
WHERE {{where|and_list}}
{{/if}}
{{#if group_by}}
GROUP BY {{group_by|comma_list}}
{{/if}}
{{#if having}}
HAVING {{having}}
{{/if}}
{{#if order_by}}
ORDER BY {{#each order_by}}{{column}} {{direction}}{{#if !@last}}, {{/if}}{{/each}}
{{/if}}
{{#if limit}}
LIMIT {{limit}}
{{/if}}
```

## Usage

```python
from exonware.xwquery.query.generators.template_engine import QueryTemplateEngine

# Initialize engine
engine = QueryTemplateEngine(template_dir='path/to/templates')

# Render query
query = engine.render_query('sql', 'select', {
    'columns': ['id', 'name', 'email'],
    'table_name': 'users',
    'where': 'age > 18',
    'limit': 10
})
```

## Note

Templates are optional. Generators can work without templates by implementing
query generation programmatically in the generator classes.

**Status:** Template engine implemented. Template files will be created as needed per format.

