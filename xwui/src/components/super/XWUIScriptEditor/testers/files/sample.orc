# Apache ORC (Optimized Row Columnar) Schema Example
# Note: ORC is binary columnar format, but this shows the schema definition

# ORC schema (using Hive DDL format):
"""
CREATE TABLE example_table (
    id INT,
    name STRING,
    active BOOLEAN,
    price DOUBLE,
    categories ARRAY<STRING>,
    created TIMESTAMP,
    metadata STRUCT<
        author: STRING,
        version: STRING,
        tags: ARRAY<STRING>
    >
)
STORED AS ORC
TBLPROPERTIES (
    'orc.compress'='SNAPPY',
    'orc.stripe.size'='67108864'
);
"""

# ORC file structure (conceptual):
# - Postscript (file footer)
# - Footer (metadata, statistics)
# - Stripe footer
# - Index data
# - Stripe data (row data in columnar format)
# - Stripe footer
# - File footer

# Sample data representation:
# id: [1, 2, 3]
# name: ['First Item', 'Second Item', 'Third Item']
# active: [true, false, true]
# price: [29.99, 49.99, 19.99]
# categories: [['electronics', 'gadgets'], ['books', 'education'], ['clothing']]
# created: [2025-01-15T10:00:00, 2025-01-15T10:05:00, 2025-01-15T10:10:00]
# metadata: [{author: 'XWUI Team', version: '1.0.0', tags: ['example']}, ...]



