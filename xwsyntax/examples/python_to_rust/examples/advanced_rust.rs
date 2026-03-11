//! Advanced Rust examples using modern features (Rust 2021+).
//!
//! Features demonstrated:
//! - Pattern matching (match)
//! - Enums with data
//! - Structs and impl blocks
//! - Generics and traits
//! - Async/await
//! - Error handling with Result
//! - Option types
//! - Lifetimes
//! - Iterators
//! - Closures
//!
//! Company: eXonware.com
//! Author: eXonware Backend Team
//! Email: connect@exonware.com
//! Version: 2.0
//! Generation Date: 15-Jan-2025

use std::collections::HashMap;
use std::fmt::Display;
use std::future::Future;
use std::time::Duration;
use tokio::time::sleep;


// ============================================================================
// Enums
// ============================================================================

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Status {
    Pending,
    Processing,
    Completed,
    Failed,
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum HttpMethod {
    Get,
    Post,
    Put,
    Delete,
    Patch,
}

impl HttpMethod {
    fn as_str(&self) -> &'static str {
        match self {
            HttpMethod::Get => "GET",
            HttpMethod::Post => "POST",
            HttpMethod::Put => "PUT",
            HttpMethod::Delete => "DELETE",
            HttpMethod::Patch => "PATCH",
        }
    }
}


// ============================================================================
// Structs
// ============================================================================

#[derive(Debug, Clone, Copy)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }
    
    fn distance_to(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

#[derive(Debug, Clone)]
struct User {
    name: String,
    email: String,
    age: u32,
    status: Status,
    tags: Vec<String>,
}

impl User {
    fn new(name: String, email: String, age: u32) -> Self {
        User {
            name,
            email,
            age,
            status: Status::Pending,
            tags: Vec::new(),
        }
    }
    
    fn is_active(&self) -> bool {
        self.status == Status::Completed
    }
}


// ============================================================================
// Generics
// ============================================================================

struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }
    
    fn push(&mut self, item: T) {
        self.items.push(item);
    }
    
    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }
    
    fn peek(&self) -> Option<&T> {
        self.items.last()
    }
    
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}

struct Cache<K, V> {
    data: HashMap<K, V>,
    max_size: usize,
}

impl<K, V> Cache<K, V>
where
    K: std::hash::Hash + Eq + Clone,
{
    fn new(max_size: usize) -> Self {
        Cache {
            data: HashMap::new(),
            max_size,
        }
    }
    
    fn get(&self, key: &K) -> Option<&V> {
        self.data.get(key)
    }
    
    fn set(&mut self, key: K, value: V) {
        if self.data.len() >= self.max_size {
            // Remove oldest entry (simplified - in real code use LRU)
            if let Some(first_key) = self.data.keys().next().cloned() {
                self.data.remove(&first_key);
            }
        }
        self.data.insert(key, value);
    }
}


// ============================================================================
// Traits
// ============================================================================

trait Drawable {
    fn draw(&self) -> String;
}

trait Renderable {
    fn render(&self) -> String;
}

impl Drawable for Point {
    fn draw(&self) -> String {
        format!("Drawing point at ({}, {})", self.x, self.y)
    }
}

impl Renderable for User {
    fn render(&self) -> String {
        format!("Rendering user: {}", self.name)
    }
}


// ============================================================================
// Pattern Matching
// ============================================================================

fn handle_status(status: Status) -> String {
    match status {
        Status::Pending => "Waiting to start".to_string(),
        Status::Processing => "Currently processing".to_string(),
        Status::Completed => "Successfully completed".to_string(),
        Status::Failed => "Operation failed".to_string(),
    }
}

#[derive(Debug)]
struct HttpResponse {
    action: String,
    path: String,
    status: u16,
}

fn process_http_request(method: &HttpMethod, path: &str) -> HttpResponse {
    match method {
        HttpMethod::Get => HttpResponse {
            action: "read".to_string(),
            path: path.to_string(),
            status: 200,
        },
        HttpMethod::Post => HttpResponse {
            action: "create".to_string(),
            path: path.to_string(),
            status: 201,
        },
        HttpMethod::Put => HttpResponse {
            action: "update".to_string(),
            path: path.to_string(),
            status: 200,
        },
        HttpMethod::Delete => HttpResponse {
            action: "delete".to_string(),
            path: path.to_string(),
            status: 204,
        },
        HttpMethod::Patch => HttpResponse {
            action: "patch".to_string(),
            path: path.to_string(),
            status: 200,
        },
    }
}

fn parse_value(value: &str) -> String {
    // In Rust, we'd use serde or similar for actual parsing
    // This is a simplified example
    if value == "null" {
        "null".to_string()
    } else if value == "true" || value == "false" {
        format!("boolean: {}", value)
    } else if let Ok(i) = value.parse::<i32>() {
        format!("integer: {}", i)
    } else if let Ok(f) = value.parse::<f64>() {
        format!("float: {}", f)
    } else {
        format!("string: {}", value)
    }
}


// ============================================================================
// Error Handling with Result
// ============================================================================

#[derive(Debug, Clone)]
struct DivisionError {
    message: String,
}

impl Display for DivisionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for DivisionError {}

fn divide(a: f64, b: f64) -> Result<f64, DivisionError> {
    if b == 0.0 {
        Err(DivisionError {
            message: "Division by zero".to_string(),
        })
    } else {
        Ok(a / b)
    }
}


// ============================================================================
// Async/Await
// ============================================================================

async fn fetch_data(url: &str) -> HashMap<String, String> {
    sleep(Duration::from_millis(100)).await; // Simulate network delay
    let mut result = HashMap::new();
    result.insert("url".to_string(), url.to_string());
    result.insert("data".to_string(), format!("Data from {}", url));
    result
}

async fn process_items(items: &[&str]) -> Vec<HashMap<String, String>> {
    let mut tasks = Vec::new();
    for item in items {
        tasks.push(fetch_data(item));
    }
    
    let mut results = Vec::new();
    for task in tasks {
        results.push(task.await);
    }
    results
}

async fn main_async() {
    let items = vec!["item1", "item2", "item3"];
    let results = process_items(&items).await;
    for result in results {
        println!("Processed: {:?}", result);
    }
}


// ============================================================================
// Iterators and Closures
// ============================================================================

fn apply_function<F>(func: F, value: i32) -> i32
where
    F: Fn(i32) -> i32,
{
    func(value)
}

fn create_multiplier(factor: i32) -> impl Fn(i32) -> i32 {
    move |x| x * factor
}

fn process_numbers(numbers: &[i32]) -> Vec<i32> {
    numbers
        .iter()
        .map(|x| x * 2)
        .filter(|x| *x > 10)
        .collect()
}


// ============================================================================
// Lifetimes
// ============================================================================

fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s1.len() > s2.len() {
        s1
    } else {
        s2
    }
}

struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn new(text: &'a str) -> Self {
        ImportantExcerpt {
            part: text.split('.').next().unwrap_or(""),
        }
    }
}


// ============================================================================
// Main
// ============================================================================

#[tokio::main]
async fn main() {
    // Test enums
    println!("=== Enums ===");
    let status = Status::Processing;
    println!("Status: {:?}", status);
    
    // Test structs
    println!("\n=== Structs ===");
    let p1 = Point::new(0.0, 0.0);
    let p2 = Point::new(3.0, 4.0);
    println!("Distance: {}", p1.distance_to(&p2));
    
    let user = User::new(
        "Alice".to_string(),
        "alice@example.com".to_string(),
        30,
    );
    println!("User active: {}", user.is_active());
    
    // Test generics
    println!("\n=== Generics ===");
    let mut stack: Stack<i32> = Stack::new();
    stack.push(1);
    stack.push(2);
    println!("Stack pop: {:?}", stack.pop());
    
    let mut cache: Cache<String, i32> = Cache::new(100);
    cache.set("key1".to_string(), 100);
    println!("Cache get: {:?}", cache.get(&"key1".to_string()));
    
    // Test pattern matching
    println!("\n=== Pattern Matching ===");
    println!("{}", handle_status(Status::Completed));
    let response = process_http_request(&HttpMethod::Post, "/api/users");
    println!("Response: {:?}", response);
    println!("{}", parse_value("42"));
    println!("{}", parse_value("hello"));
    
    // Test Result type
    println!("\n=== Result Type ===");
    match divide(10.0, 2.0) {
        Ok(result) => println!("Divide result: {}", result),
        Err(e) => println!("Divide error: {}", e),
    }
    
    match divide(10.0, 0.0) {
        Ok(result) => println!("Divide result: {}", result),
        Err(e) => println!("Divide error: {}", e),
    }
    
    // Test async
    println!("\n=== Async ===");
    main_async().await;
    
    // Test higher-order functions
    println!("\n=== Higher-Order Functions ===");
    let double = create_multiplier(2);
    println!("Double 5: {}", apply_function(double, 5));
    
    // Test iterators
    println!("\n=== Iterators ===");
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8];
    let processed = process_numbers(&numbers);
    println!("Processed numbers: {:?}", processed);
    
    // Test lifetimes
    println!("\n=== Lifetimes ===");
    let s1 = "short";
    let s2 = "much longer string";
    println!("Longest: {}", longest(s1, s2));
    
    let excerpt = ImportantExcerpt::new("This is a long text. It has multiple sentences.");
    println!("Excerpt: {}", excerpt.part);
}
