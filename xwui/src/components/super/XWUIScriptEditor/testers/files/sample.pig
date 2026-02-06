-- Pig Latin Examples
-- Data flow language for Apache Pig

-- Load data
users = LOAD '/data/users.csv' 
USING PigStorage(',') 
AS (id:int, name:chararray, age:int, city:chararray);

-- Filter
adults = FILTER users BY age >= 18;

-- Project (select columns)
names = FOREACH users GENERATE name, age;

-- Group
grouped = GROUP users BY city;

-- Aggregations
city_stats = FOREACH grouped GENERATE 
    group AS city,
    COUNT(users) AS user_count,
    AVG(users.age) AS avg_age,
    MAX(users.age) AS max_age,
    MIN(users.age) AS min_age;

-- Join
users = LOAD '/data/users.csv' USING PigStorage(',') 
AS (id:int, name:chararray, age:int);

orders = LOAD '/data/orders.csv' USING PigStorage(',')
AS (orderId:int, userId:int, total:double);

joined = JOIN users BY id, orders BY userId;

-- CoGroup (similar to outer join)
cogrouped = COGROUP users BY id, orders BY userId;

-- Union
all_users = UNION users1, users2;

-- Distinct
unique_cities = DISTINCT (FOREACH users GENERATE city);

-- Order
sorted = ORDER users BY age DESC;

-- Limit
top_10 = LIMIT sorted 10;

-- Complex data flow
result = FOREACH (GROUP (FILTER users BY age > 25) BY city) GENERATE
    group AS city,
    COUNT($1) AS count,
    AVG($1.age) AS avg_age;

-- Store results
STORE result INTO '/output/city_stats' USING PigStorage(',');

-- Nested operations
result = FOREACH (GROUP users BY city) {
    sorted = ORDER users BY age DESC;
    top_5 = LIMIT sorted 5;
    GENERATE group AS city, top_5;
}

