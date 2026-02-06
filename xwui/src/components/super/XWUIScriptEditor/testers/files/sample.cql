-- CQL (Cassandra Query Language) Examples
-- Apache Cassandra query language

-- Create keyspace
CREATE KEYSPACE example_keyspace
WITH REPLICATION = {
    'class': 'SimpleStrategy',
    'replication_factor': 3
};

USE example_keyspace;

-- Create table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT,
    age INT,
    city TEXT,
    created_date TIMESTAMP
);

-- Insert data
INSERT INTO users (id, name, email, age, city, created_date)
VALUES (uuid(), 'John Doe', 'john@example.com', 30, 'New York', toTimestamp(now()));

-- Select queries
SELECT * FROM users WHERE id = uuid();

-- Select with filtering (requires ALLOW FILTERING for non-key columns)
SELECT * FROM users WHERE city = 'New York' ALLOW FILTERING;

-- Update
UPDATE users
SET age = 31, email = 'john.doe@example.com'
WHERE id = uuid();

-- Delete
DELETE FROM users WHERE id = uuid();

-- Batch operations
BEGIN BATCH
    INSERT INTO users (id, name, email) VALUES (uuid(), 'Alice', 'alice@example.com');
    INSERT INTO users (id, name, email) VALUES (uuid(), 'Bob', 'bob@example.com');
    UPDATE users SET age = 25 WHERE id = uuid();
APPLY BATCH;

-- Create table with clustering
CREATE TABLE orders (
    user_id UUID,
    order_id UUID,
    total DECIMAL,
    status TEXT,
    created_date TIMESTAMP,
    PRIMARY KEY (user_id, order_id)
) WITH CLUSTERING ORDER BY (order_id DESC);

-- Query with clustering key
SELECT * FROM orders 
WHERE user_id = uuid() 
AND order_id > uuid()
ORDER BY order_id DESC;

-- Aggregations (limited in CQL)
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;

-- Index creation
CREATE INDEX ON users (email);
CREATE INDEX ON users (city);

-- Materialized view
CREATE MATERIALIZED VIEW users_by_city AS
SELECT city, id, name, email, age
FROM users
WHERE city IS NOT NULL AND id IS NOT NULL
PRIMARY KEY (city, id);

