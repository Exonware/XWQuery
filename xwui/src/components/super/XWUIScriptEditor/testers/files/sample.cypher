// Cypher Query Examples (Neo4j Graph Database)

// Create nodes
CREATE (doc:Document {
  name: 'Sample Cypher Document',
  version: '1.0.0',
  description: 'Cypher query examples',
  created: '2025-01-15T10:30:00Z'
})

CREATE (meta:Metadata {
  author: 'XWUI Team',
  created: '2025-01-15T10:30:00Z',
  tags: ['example', 'cypher', 'graph']
})

CREATE (item1:Item {
  id: 1,
  name: 'First Item',
  active: true,
  price: 29.99
})

CREATE (item2:Item {
  id: 2,
  name: 'Second Item',
  active: false,
  price: 49.99
})

// Create relationships
CREATE (doc)-[:HAS_METADATA]->(meta)
CREATE (doc)-[:CONTAINS]->(item1)
CREATE (doc)-[:CONTAINS]->(item2)
CREATE (item1)-[:RELATED_TO]->(item2)

// Query examples
MATCH (doc:Document {name: 'Sample Cypher Document'})
RETURN doc

MATCH (doc:Document)-[:HAS_METADATA]->(meta:Metadata)
RETURN doc, meta

MATCH (doc:Document)-[:CONTAINS]->(item:Item)
WHERE item.active = true
RETURN doc.name, collect(item.name) as active_items

// Path queries
MATCH path = (doc:Document)-[*1..3]-(related)
RETURN path

// Aggregations
MATCH (doc:Document)-[:CONTAINS]->(item:Item)
RETURN doc.name, count(item) as item_count, avg(item.price) as avg_price

// Update
MATCH (item:Item {id: 1})
SET item.price = 35.99, item.updated = '2025-01-15T11:00:00Z'
RETURN item

// Delete
MATCH (item:Item {id: 2})
DELETE item



