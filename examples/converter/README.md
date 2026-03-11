# Query Format Converter

A simple console tool to convert queries between different formats using XWQuery.

## Usage

```bash
python converter.py <from_format> <to_format> <query>
```

## Examples

Convert SQL to Cypher:
```bash
python converter.py SQL CYPHER "SELECT name, age FROM users WHERE age > 25"
```

Convert Cypher to GraphQL:
```bash
python converter.py CYPHER GRAPHQL "MATCH (n:User) RETURN n.name, n.age"
```

Convert SQL to nGQL:
```bash
python converter.py SQL NGQL "SELECT name FROM users WHERE age > 25"
```

Convert MongoDB Aggregation to SQL:
```bash
python converter.py MONGODB_AGGREGATION SQL 'db.users.aggregate([{"$match": {"age": 25}}])'
```

## Supported Formats

The converter supports all formats available in XWQuery, including:

**SQL/Database:**
- SQL, SQLITE, MYSQL, POSTGRESQL
- MONGODB_AGGREGATION, ARANGODB_AQL, EDGEQL, SURREALQL
- CYPHER_AGE, ASTERIXDB_AQL, SQL_PLUS_PLUS, ELASTICSEARCH_SQL
- N1QL, PARTIQL, CQL

**Graph:**
- CYPHER, OPENCYPHER, GSQL, NGQL, DQL
- GREMLIN, SPARQL, GQL

**Document/JSON:**
- JSONPATH, JSONATA, JSONNET, JSON_PATCH
- COUCHDB_MANGO, JMESPATH, JQ, JSON_QUERY

**Processing/ETL:**
- NIFI_EL, LOGSTASH, FLUENT_BIT, FLUENTD, PAINLESS
- STARLARK, AWK, SED, BASH_PIPELINE

And many more!

## Notes

- Format names are case-insensitive (will be converted to uppercase)
- Multi-word queries should be enclosed in quotes
- The converter uses XWQuery's universal conversion system
- Installation messages from xwlazy (auto-installer) are suppressed by default for cleaner output

## About xwlazy Messages

If you see messages like `[INSTALL] [xwlazy] Blocking Install: cachebox...`, these indicate that `xwlazy` is automatically installing missing dependencies on-demand. This is normal behavior - the packages weren't installed, and xwlazy is installing them automatically when needed.

To suppress these messages, the converter sets `XWLAZY_LOG_INSTALL=0` by default. To see installation messages, set:
```bash
set XWLAZY_LOG_INSTALL=1
python converter.py SQL CYPHER "SELECT name FROM users"
```
