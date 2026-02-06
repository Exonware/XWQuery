// Sample Java Code
// Comprehensive Java example demonstrating various features

package com.example;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Metadata class for document information
 */
public class Metadata {
    private String author;
    private String created;
    private List<String> tags;
    
    public Metadata(String author, String created, List<String> tags) {
        this.author = author;
        this.created = created;
        this.tags = tags;
    }
    
    // Getters and setters
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getCreated() { return created; }
    public void setCreated(String created) { this.created = created; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}

/**
 * Item class representing a document item
 */
public class Item {
    private int id;
    private String name;
    private boolean active;
    private double price;
    private List<String> categories;
    
    public Item(int id, String name, boolean active, double price, List<String> categories) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.price = price;
        this.categories = categories;
    }
    
    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }
}

/**
 * Main document class
 */
public class Document {
    private String name;
    private String version;
    private String description;
    private Metadata metadata;
    private List<Item> items;
    
    public Document(String name, String version, String description) {
        this.name = name;
        this.version = version;
        this.description = description;
        this.items = new ArrayList<>();
        this.metadata = new Metadata(
            "XWUI Team",
            LocalDateTime.now().toString(),
            List.of("example", "java")
        );
    }
    
    public void addItem(Item item) {
        this.items.add(item);
    }
    
    public List<Item> getActiveItems() {
        return items.stream()
            .filter(Item::isActive)
            .collect(Collectors.toList());
    }
    
    public double getTotalPrice() {
        return items.stream()
            .filter(Item::isActive)
            .mapToDouble(Item::getPrice)
            .sum();
    }
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Metadata getMetadata() { return metadata; }
    public void setMetadata(Metadata metadata) { this.metadata = metadata; }
    
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
    
    public static void main(String[] args) {
        Document doc = new Document(
            "Sample Java Document",
            "1.0.0",
            "Java code example"
        );
        
        doc.addItem(new Item(
            1, "First Item", true, 29.99,
            List.of("electronics", "gadgets")
        ));
        
        doc.addItem(new Item(
            2, "Second Item", false, 49.99,
            List.of("books", "education")
        ));
        
        System.out.println("Document: " + doc.getName());
        System.out.println("Active items: " + doc.getActiveItems().size());
        System.out.println("Total price: $" + doc.getTotalPrice());
    }
}



