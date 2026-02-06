// C Example
// Comprehensive C code demonstrating various features

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

// Metadata structure
typedef struct {
    char author[100];
    char created[50];
    char tags[200];
} Metadata;

// Item structure
typedef struct {
    int id;
    char name[100];
    bool active;
    double price;
    char categories[200];
} Item;

// Document structure
typedef struct {
    char name[100];
    char version[20];
    char description[200];
    Metadata metadata;
    Item items[10];
    int item_count;
} Document;

// Function to initialize document
void initDocument(Document* doc, const char* name, const char* version, const char* description) {
    strcpy(doc->name, name);
    strcpy(doc->version, version);
    strcpy(doc->description, description);
    strcpy(doc->metadata.author, "XWUI Team");
    strcpy(doc->metadata.created, "2025-01-15T10:30:00Z");
    strcpy(doc->metadata.tags, "example,c,c-language");
    doc->item_count = 0;
}

// Function to add item
void addItem(Document* doc, int id, const char* name, bool active, double price) {
    if (doc->item_count < 10) {
        Item* item = &doc->items[doc->item_count];
        item->id = id;
        strcpy(item->name, name);
        item->active = active;
        item->price = price;
        strcpy(item->categories, "electronics,gadgets");
        doc->item_count++;
    }
}

// Function to get total price of active items
double getTotalPrice(Document* doc) {
    double total = 0.0;
    for (int i = 0; i < doc->item_count; i++) {
        if (doc->items[i].active) {
            total += doc->items[i].price;
        }
    }
    return total;
}

// Function to count active items
int countActiveItems(Document* doc) {
    int count = 0;
    for (int i = 0; i < doc->item_count; i++) {
        if (doc->items[i].active) {
            count++;
        }
    }
    return count;
}

// Main function
int main() {
    Document doc;
    initDocument(&doc, "Sample C Document", "1.0.0", "C code example");
    
    addItem(&doc, 1, "First Item", true, 29.99);
    addItem(&doc, 2, "Second Item", false, 49.99);
    
    printf("Document: %s\n", doc.name);
    printf("Version: %s\n", doc.version);
    printf("Active items: %d\n", countActiveItems(&doc));
    printf("Total price: $%.2f\n", getTotalPrice(&doc));
    
    return 0;
}

