// Swift Example
// Comprehensive Swift code demonstrating various features

import Foundation

// Metadata structure
struct Metadata {
    var author: String
    var created: String
    var tags: [String]
    
    init() {
        self.author = "XWUI Team"
        self.created = ISO8601DateFormatter().string(from: Date())
        self.tags = ["example", "swift"]
    }
}

// Item structure
struct Item {
    var id: Int
    var name: String
    var active: Bool
    var price: Double
    var categories: [String]
    
    init(id: Int, name: String, active: Bool, price: Double, categories: [String] = []) {
        self.id = id
        self.name = name
        self.active = active
        self.price = price
        self.categories = categories
    }
}

// Document class
class Document {
    var name: String
    var version: String
    var description: String
    var metadata: Metadata
    var items: [Item]
    
    init(name: String, version: String, description: String) {
        self.name = name
        self.version = version
        self.description = description
        self.metadata = Metadata()
        self.items = []
    }
    
    func addItem(_ item: Item) {
        items.append(item)
    }
    
    func getActiveItems() -> [Item] {
        return items.filter { $0.active }
    }
    
    func getTotalPrice() -> Double {
        return getActiveItems().reduce(0) { $0 + $1.price }
    }
    
    func toJSON() -> String? {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        
        let data: [String: Any] = [
            "name": name,
            "version": version,
            "description": description,
            "metadata": [
                "author": metadata.author,
                "created": metadata.created,
                "tags": metadata.tags
            ],
            "items": items.map { [
                "id": $0.id,
                "name": $0.name,
                "active": $0.active,
                "price": $0.price,
                "categories": $0.categories
            ]}
        ]
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: data, options: .prettyPrinted),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            return jsonString
        }
        return nil
    }
}

// Example usage
let doc = Document(
    name: "Sample Swift Document",
    version: "1.0.0",
    description: "Swift code example"
)

doc.addItem(Item(
    id: 1,
    name: "First Item",
    active: true,
    price: 29.99,
    categories: ["electronics", "gadgets"]
))

doc.addItem(Item(
    id: 2,
    name: "Second Item",
    active: false,
    price: 49.99,
    categories: ["books", "education"]
))

print("Document: \(doc.name)")
print("Active items: \(doc.getActiveItems().count)")
print("Total price: $\(String(format: "%.2f", doc.getTotalPrice()))")

if let json = doc.toJSON() {
    print("\nJSON:\n\(json)")
}

