// LINQ (Language Integrated Query) Examples
// .NET query syntax

// Basic query
from user in users
where user.Age > 25
select user.Name

// Method syntax
users.Where(u => u.Age > 25).Select(u => u.Name)

// Joins
from user in users
join order in orders on user.Id equals order.UserId
select new { user.Name, order.Total }

// Grouping
from user in users
group user by user.City into g
select new { City = g.Key, Count = g.Count() }

// Aggregations
from order in orders
where order.Date.Year == 2025
select new {
    TotalRevenue = orders.Sum(o => o.Total),
    AvgOrder = orders.Average(o => o.Total),
    MaxOrder = orders.Max(o => o.Total),
    MinOrder = orders.Min(o => o.Total)
}

// Nested queries
from user in users
select new {
    user.Name,
    Orders = from order in orders
             where order.UserId == user.Id
             select order
}

// Sorting
from user in users
orderby user.Name ascending, user.Age descending
select user

// Take/Skip
from user in users
where user.Active == true
orderby user.CreatedDate descending
select user
take 10

// Complex filtering
from order in orders
where order.Status == "Completed" &&
      order.Total > 100 &&
      order.Date >= DateTime.Now.AddDays(-30)
select order

// Aggregations with grouping
from order in orders
group order by order.Category into g
select new {
    Category = g.Key,
    TotalRevenue = g.Sum(o => o.Total),
    OrderCount = g.Count(),
    AvgOrderValue = g.Average(o => o.Total)
}

