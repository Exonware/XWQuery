-- HQL (Hibernate Query Language) Examples
-- Object-oriented query language

-- Basic SELECT
FROM User WHERE age > 25

-- Selecting specific fields
SELECT name, email FROM User WHERE active = true

-- Named parameters
FROM User WHERE name = :userName AND age > :minAge

-- Joins
SELECT u.name, o.total
FROM User u
JOIN u.orders o
WHERE o.status = 'completed'

-- Aggregations
SELECT 
    u.department,
    COUNT(u.id) as employee_count,
    AVG(u.salary) as avg_salary
FROM User u
GROUP BY u.department

-- Subqueries
FROM User u
WHERE u.id IN (
    SELECT o.user.id 
    FROM Order o 
    WHERE o.total > 1000
)

-- Polymorphic queries
FROM Person WHERE age > 25
-- Returns instances of Person and all subclasses

-- Collection operations
FROM User u
WHERE SIZE(u.orders) > 5

FROM User u
WHERE 'completed' IN ELEMENTS(u.orderStatuses)

-- Date functions
FROM Order o
WHERE o.date >= :startDate AND o.date <= :endDate

-- String functions
FROM User u
WHERE UPPER(u.name) LIKE '%SMITH%'

-- Update
UPDATE User SET active = false WHERE lastLogin < :cutoffDate

-- Delete
DELETE FROM User WHERE active = false AND lastLogin < :cutoffDate

-- Pagination
FROM User ORDER BY name
-- Use setFirstResult() and setMaxResults() in code

-- Projections
SELECT u.name, COUNT(o.id)
FROM User u
LEFT JOIN u.orders o
GROUP BY u.name

