-- SQL Query Examples
-- Comprehensive SQL examples for various operations

-- Create tables
CREATE TABLE metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    description TEXT,
    author VARCHAR(255),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    tags JSON
);

CREATE TABLE configuration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    UNIQUE(category, key)
);

CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    price DECIMAL(10, 2),
    categories JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO metadata (name, version, description, author, created, tags) VALUES
('Sample SQL Document', '1.0.0', 'SQL query examples', 'XWUI Team', '2025-01-15T10:30:00Z', '["example", "sql", "database"]');

INSERT INTO configuration (category, key, value) VALUES
('database', 'host', 'localhost'),
('database', 'port', '5432'),
('database', 'name', 'example_db'),
('database', 'ssl', 'true');

INSERT INTO items (name, active, price, categories) VALUES
('First Item', TRUE, 29.99, '["electronics", "gadgets"]'),
('Second Item', FALSE, 49.99, '["books", "education"]'),
('Third Item', TRUE, 19.99, '["clothing", "accessories"]');

-- SELECT queries
SELECT * FROM metadata;
SELECT name, version FROM metadata WHERE author = 'XWUI Team';
SELECT * FROM items WHERE active = TRUE ORDER BY price DESC;
SELECT category, COUNT(*) as count FROM configuration GROUP BY category;

-- JOIN queries
SELECT m.name, m.version, c.key, c.value
FROM metadata m
LEFT JOIN configuration c ON m.id = 1;

-- Subqueries
SELECT * FROM items
WHERE price > (SELECT AVG(price) FROM items);

-- Aggregations
SELECT 
    COUNT(*) as total_items,
    AVG(price) as avg_price,
    MAX(price) as max_price,
    MIN(price) as min_price
FROM items
WHERE active = TRUE;

-- Update and Delete
UPDATE items SET price = price * 1.1 WHERE active = TRUE;
DELETE FROM items WHERE active = FALSE;



