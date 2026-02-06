// C++ Example
// Comprehensive C++ code demonstrating various features

#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <algorithm>
#include <chrono>
#include <iomanip>

// Metadata structure
struct Metadata {
    std::string author;
    std::string created;
    std::vector<std::string> tags;
    
    Metadata() : author("XWUI Team"), created("2025-01-15T10:30:00Z") {
        tags = {"example", "cpp", "c++"};
    }
};

// Item structure
struct Item {
    int id;
    std::string name;
    bool active;
    double price;
    std::vector<std::string> categories;
    
    Item(int id, const std::string& name, bool active, double price)
        : id(id), name(name), active(active), price(price) {}
};

// Document class
class Document {
private:
    std::string name;
    std::string version;
    std::string description;
    Metadata metadata;
    std::vector<Item> items;
    
public:
    Document(const std::string& name, const std::string& version, const std::string& description)
        : name(name), version(version), description(description) {}
    
    void addItem(const Item& item) {
        items.push_back(item);
    }
    
    std::vector<Item> getActiveItems() const {
        std::vector<Item> active;
        std::copy_if(items.begin(), items.end(), std::back_inserter(active),
            [](const Item& item) { return item.active; });
        return active;
    }
    
    double getTotalPrice() const {
        double total = 0.0;
        for (const auto& item : items) {
            if (item.active) {
                total += item.price;
            }
        }
        return total;
    }
    
    void print() const {
        std::cout << "Document: " << name << std::endl;
        std::cout << "Version: " << version << std::endl;
        std::cout << "Active items: " << getActiveItems().size() << std::endl;
        std::cout << "Total price: $" << std::fixed << std::setprecision(2) 
                  << getTotalPrice() << std::endl;
    }
};

// Main function
int main() {
    Document doc("Sample C++ Document", "1.0.0", "C++ code example");
    
    doc.addItem(Item(1, "First Item", true, 29.99));
    doc.addItem(Item(2, "Second Item", false, 49.99));
    
    doc.print();
    
    return 0;
}

