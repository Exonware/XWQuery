// Apache Thrift IDL Example
namespace java example
namespace py example

// Metadata structure
struct Metadata {
    1: string author,
    2: string created,
    3: list<string> tags
}

// Database configuration
struct DatabaseConfig {
    1: string host,
    2: i32 port,
    3: string name,
    4: bool ssl
}

// Item structure
struct Item {
    1: i32 id,
    2: string name,
    3: bool active,
    4: double price,
    5: list<string> categories
}

// Main document structure
struct Document {
    1: string name,
    2: string version,
    3: optional string description,
    4: Metadata metadata,
    5: DatabaseConfig database,
    6: list<Item> items
}

// Service definition
service DocumentService {
    Document getDocument(1: string id),
    Document createDocument(1: Document document),
    void updateDocument(1: string id, 2: Document document),
    void deleteDocument(1: string id)
}

// Exception definition
exception DocumentNotFound {
    1: string message,
    2: string documentId
}



