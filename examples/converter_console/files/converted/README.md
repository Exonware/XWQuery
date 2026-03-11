# XWQuery Format Conversion Results

This directory contains converted query files organized by format type.

## Structure

```
converted/
├── sql/
│   ├── level_easy.sql
│   ├── level_medium.sql
│   └── level_hard.sql
├── graphql/
│   ├── level_easy.graphql
│   ├── level_medium.graphql
│   └── level_hard.graphql
├── cypher/
│   └── ...
└── [26 format directories total]
```

## Conversion Results

### Successfully Converted Formats (26)

1. **SQL Family**
   - `sql/` - Standard SQL
   - `n1ql/` - Couchbase N1QL
   - `partiql/` - AWS PartiQL
   - `hiveql/` - Apache HiveQL
   - `hql/` - Hibernate Query Language
   - `cql/` - Cassandra Query Language
   - `kql/` - Azure Kusto Query Language

2. **Graph Query Languages**
   - `graphql/` - GraphQL
   - `cypher/` - Neo4j Cypher
   - `gremlin/` - Apache TinkerPop Gremlin
   - `sparql/` - SPARQL (RDF)
   - `gql/` - ISO Graph Query Language

3. **Document/JSON Query Languages**
   - `jmespath/` - JMESPath
   - `jq/` - jq JSON processor
   - `jsoniq/` - JSONiq
   - `xpath/` - XPath
   - `xquery/` - XQuery
   - `mql/` - MongoDB Query Language

4. **Time-Series Query Languages**
   - `promql/` - Prometheus Query Language
   - `flux/` - InfluxDB Flux
   - `logql/` - Loki Query Language
   - `eql/` - Elastic Query Language

5. **Search & Analytics**
   - `elasticsearch/` - Elasticsearch DSL

6. **Streaming/ETL**
   - `datalog/` - Datalog
   - `linq/` - Language Integrated Query
   - `pig/` - Apache Pig Latin

### Formats Not Available (4)

- `mongodb/` - Strategy not implemented
- `couchdb/` - Strategy not implemented
- `reql/` - Abstract class (not instantiable)
- `rql/` - Abstract class (not instantiable)

## Input Files

The conversions were generated from:
- `files/level_easy.xwqs` - Simple SELECT with WHERE and ORDER BY
- `files/level_medium.xwqs` - JOINs, aggregations, GROUP BY, HAVING
- `files/level_hard.xwqs` - CTEs, window functions, subqueries, CASE expressions

## Usage

To regenerate all conversions:

```bash
cd examples/converter_console
python convert_all_formats.py
```

## Statistics

- **Total formats attempted:** 30
- **Successfully converted:** 26 (87%)
- **Failed:** 4 (13%)
- **Total files generated:** 78 (26 formats × 3 levels)

## Notes

- All conversions are from XWQuery Script format (`.xwqs`)
- Output files use format-specific extensions
- Some formats may produce simplified output depending on feature support
- Complex queries (level_hard) may not convert perfectly to all formats due to feature differences
