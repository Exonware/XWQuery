# XWQueryScript Commands Reference

**Console:** `xwnode_console2`  
**Collection Name:** `records`  
**Note:** XWQuery operates on a sample (default: 10,000 records) for performance.

---

## 📖 **READ Operations (SELECT / LIST / SEARCH)**

### Basic SELECT

```sql
-- Get all records (limited to sample)
SELECT * FROM records

-- Get first 10 records
SELECT * FROM records LIMIT 10

-- Get specific fields
SELECT id, name, city FROM records LIMIT 5

-- Get records with pagination
SELECT * FROM records LIMIT 20 OFFSET 0
SELECT * FROM records LIMIT 20 OFFSET 20
```

### Filtering / Searching

```sql
-- Filter by condition
SELECT * FROM records WHERE city = "Riyadh"

-- Multiple conditions
SELECT * FROM records WHERE age > 30 AND active = true

-- Pattern matching (LIKE)
SELECT * FROM records WHERE name LIKE "John%"
SELECT * FROM records WHERE email LIKE "%@example.com"

-- Range queries
SELECT * FROM records WHERE age BETWEEN 25 AND 45
SELECT * FROM records WHERE price BETWEEN 100 AND 500

-- Membership testing (IN)
SELECT * FROM records WHERE city IN ["Riyadh", "Jeddah", "Dammam"]
SELECT * FROM records WHERE status IN ["active", "pending"]

-- Property existence (HAS)
SELECT * FROM records WHERE HAS email
SELECT * FROM records WHERE HAS phone AND HAS address

-- Complex conditions
SELECT * FROM records WHERE (age > 25 OR role = "admin") AND active = true
```

### Sorting

```sql
-- Sort ascending
SELECT * FROM records ORDER BY age ASC LIMIT 10

-- Sort descending
SELECT * FROM records ORDER BY name DESC LIMIT 10

-- Multiple sort fields
SELECT * FROM records ORDER BY city ASC, age DESC LIMIT 20
```

### Aggregation / Statistics

```sql
-- Count records
SELECT COUNT(*) FROM records
SELECT COUNT(*) FROM records WHERE city = "Riyadh"

-- Sum values
SELECT SUM(price) FROM records
SELECT SUM(amount) FROM records WHERE status = "completed"

-- Average
SELECT AVG(age) FROM records
SELECT AVG(price) FROM records WHERE category = "Electronics"

-- Min/Max
SELECT MIN(age) FROM records
SELECT MAX(price) FROM records
SELECT MIN(price), MAX(price) FROM records WHERE category = "Books"

-- Group by
SELECT city, COUNT(*) FROM records GROUP BY city
SELECT category, AVG(price), COUNT(*) FROM records GROUP BY category

-- Having (filter groups)
SELECT city, COUNT(*) as count FROM records 
GROUP BY city 
HAVING count > 10
```

### Distinct Values

```sql
-- Get unique values
SELECT DISTINCT city FROM records
SELECT DISTINCT category FROM records

-- Count distinct
SELECT COUNT(DISTINCT city) FROM records
```

---

## ➕ **CREATE Operations (INSERT)**

### Insert Single Record

```sql
-- Insert with all fields
INSERT INTO records VALUES {
  id: "user_001",
  name: "John Doe",
  age: 30,
  city: "Riyadh",
  email: "john@example.com",
  active: true
}

-- Insert with minimal fields
INSERT INTO records VALUES {
  id: "user_002",
  name: "Jane Smith",
  city: "Jeddah"
}

-- Insert with nested objects
INSERT INTO records VALUES {
  id: "user_003",
  name: "Bob Wilson",
  address: {
    street: "123 Main St",
    city: "Dammam",
    zip: "12345"
  }
}
```

### Insert Multiple Records

```sql
-- Multiple inserts (run separately)
INSERT INTO records VALUES {id: "u1", name: "Alice"}
INSERT INTO records VALUES {id: "u2", name: "Bob"}
INSERT INTO records VALUES {id: "u3", name: "Charlie"}
```

---

## ✏️ **UPDATE Operations**

### Update Single Record

```sql
-- Update by ID
UPDATE records SET age = 31 WHERE id = "user_001"
UPDATE records SET city = "Jeddah" WHERE id = "user_002"

-- Update multiple fields
UPDATE records SET age = 32, city = "Riyadh" WHERE id = "user_001"

-- Update with conditions
UPDATE records SET active = false WHERE age < 18
UPDATE records SET status = "inactive" WHERE last_login < "2024-01-01"
```

### Bulk Updates

```sql
-- Update all matching records
UPDATE records SET role = "user" WHERE role = "guest"
UPDATE records SET discount = 0.1 WHERE category = "Electronics"

-- Conditional updates
UPDATE records SET price = price * 0.9 WHERE stock > 100
UPDATE records SET age = age + 1 WHERE birthday_month = 12
```

---

## 🗑️ **DELETE Operations**

### Delete by Condition

```sql
-- Delete by ID
DELETE FROM records WHERE id = "user_001"

-- Delete by condition
DELETE FROM records WHERE age < 18
DELETE FROM records WHERE active = false

-- Delete with multiple conditions
DELETE FROM records WHERE status = "deleted" AND last_modified < "2023-01-01"

-- Delete all (use with caution!)
DELETE FROM records
```

---

## 🔍 **Advanced Search Operations**

### Text Search

```sql
-- Pattern matching
SELECT * FROM records WHERE name LIKE "%John%"
SELECT * FROM records WHERE email LIKE "%@gmail.com"

-- Case-insensitive (if supported)
SELECT * FROM records WHERE LOWER(name) LIKE "%john%"
```

### Complex Queries

```sql
-- Subqueries / WITH clause
WITH active_users AS (
  SELECT * FROM records WHERE active = true
)
SELECT * FROM active_users WHERE age > 25

-- Joins (if multiple collections exist)
SELECT u.name, o.total 
FROM records u 
JOIN orders o ON u.id = o.user_id 
WHERE o.total > 100

-- Union
SELECT * FROM records WHERE city = "Riyadh"
UNION
SELECT * FROM records WHERE city = "Jeddah"
```

### Projection / Transformation

```sql
-- Select specific fields only
SELECT id, name, email FROM records LIMIT 10

-- Computed fields (if supported)
SELECT id, name, age, age * 2 as double_age FROM records

-- Rename fields
SELECT id as user_id, name as full_name FROM records
```

---

## 📊 **Analytics Queries**

### Statistical Analysis

```sql
-- Summary statistics
SELECT 
  COUNT(*) as total,
  AVG(age) as avg_age,
  MIN(age) as min_age,
  MAX(age) as max_age
FROM records

-- Grouped statistics
SELECT 
  city,
  COUNT(*) as count,
  AVG(age) as avg_age,
  SUM(price) as total_revenue
FROM records
GROUP BY city
ORDER BY count DESC
```

### Top N Queries

```sql
-- Top 10 by value
SELECT * FROM records ORDER BY price DESC LIMIT 10

-- Top cities by count
SELECT city, COUNT(*) as count 
FROM records 
GROUP BY city 
ORDER BY count DESC 
LIMIT 10
```

---

## 🎯 **Practical Examples for Your Dataset**

### Discover Your Data

```sql
-- See what fields exist
SELECT * FROM records LIMIT 1

-- Count total records (in sample)
SELECT COUNT(*) FROM records

-- See unique cities
SELECT DISTINCT city FROM records LIMIT 20

-- See data distribution
SELECT city, COUNT(*) as count 
FROM records 
GROUP BY city 
ORDER BY count DESC 
LIMIT 10
```

### Common Workflows

```sql
-- 1. Find a specific record
SELECT * FROM records WHERE id = "your_id_here"

-- 2. Update it
UPDATE records SET city = "New City" WHERE id = "your_id_here"

-- 3. Verify the update
SELECT * FROM records WHERE id = "your_id_here"

-- 4. Delete if needed
DELETE FROM records WHERE id = "your_id_here"
```

---

## ⚠️ **Important Notes**

1. **Sample Limitation**: XWQuery operates on a sample (default: 10,000 records) loaded into memory. For full dataset operations, use low-level commands:
   - `get id <ID>` - Get by ID (full dataset)
   - `get line <N>` - Get by line number (full dataset)
   - `page <page> <size>` - Pagination (full dataset)
   - `find field=value` - Search (full dataset)

2. **Collection Name**: Always use `records` as the collection name in XWQueryScript.

3. **Syntax**: 
   - Use `;` to end queries (optional in console)
   - JSON objects use `{key: value}` syntax
   - Strings can use single or double quotes

4. **Performance**: 
   - SELECT queries are fast on the sample
   - INSERT/UPDATE/DELETE modify the in-memory sample only
   - Changes to the sample do NOT persist to the file
   - Use low-level commands (`append`, `update id`, `delete id`) to modify the actual file

---

## 🚀 **Quick Start Examples**

Copy and paste these into your console:

```sql
-- 1. See what's in your data
SELECT * FROM records LIMIT 5

-- 2. Count records
SELECT COUNT(*) FROM records

-- 3. Find records by city
SELECT * FROM records WHERE city = "Riyadh" LIMIT 10

-- 4. Get statistics
SELECT city, COUNT(*) as count FROM records GROUP BY city LIMIT 10

-- 5. Insert a test record
INSERT INTO records VALUES {id: "test_001", name: "Test User", city: "Riyadh"}

-- 6. Verify it was inserted
SELECT * FROM records WHERE id = "test_001"

-- 7. Update it
UPDATE records SET city = "Jeddah" WHERE id = "test_001"

-- 8. Delete it
DELETE FROM records WHERE id = "test_001"
```

---

**Happy Querying! 🎉**

