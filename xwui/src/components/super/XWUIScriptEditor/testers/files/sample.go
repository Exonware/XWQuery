// Sample Go Code
// Comprehensive Go example demonstrating various features

package main

import (
	"fmt"
	"time"
)

// Metadata represents document metadata
type Metadata struct {
	Author  string
	Created string
	Tags    []string
}

// Item represents a document item
type Item struct {
	ID         int
	Name       string
	Active     bool
	Price      float64
	Categories []string
}

// Document represents the main document
type Document struct {
	Name        string
	Version     string
	Description string
	Metadata    Metadata
	Items       []Item
}

// NewDocument creates a new document with default metadata
func NewDocument(name, version, description string) *Document {
	return &Document{
		Name:        name,
		Version:     version,
		Description: description,
		Metadata: Metadata{
			Author:  "XWUI Team",
			Created: time.Now().Format(time.RFC3339),
			Tags:    []string{"example", "go"},
		},
		Items: make([]Item, 0),
	}
}

// AddItem adds an item to the document
func (d *Document) AddItem(item Item) {
	d.Items = append(d.Items, item)
}

// GetActiveItems returns all active items
func (d *Document) GetActiveItems() []Item {
	var activeItems []Item
	for _, item := range d.Items {
		if item.Active {
			activeItems = append(activeItems, item)
		}
	}
	return activeItems
}

// GetTotalPrice calculates the total price of active items
func (d *Document) GetTotalPrice() float64 {
	total := 0.0
	for _, item := range d.Items {
		if item.Active {
			total += item.Price
		}
	}
	return total
}

// String returns a string representation of the document
func (d *Document) String() string {
	return fmt.Sprintf("Document{Name: %s, Version: %s, Items: %d}",
		d.Name, d.Version, len(d.Items))
}

func main() {
	// Create document
	doc := NewDocument(
		"Sample Go Document",
		"1.0.0",
		"Go code example",
	)
	
	// Add items
	doc.AddItem(Item{
		ID:         1,
		Name:       "First Item",
		Active:     true,
		Price:      29.99,
		Categories: []string{"electronics", "gadgets"},
	})
	
	doc.AddItem(Item{
		ID:         2,
		Name:       "Second Item",
		Active:     false,
		Price:      49.99,
		Categories: []string{"books", "education"},
	})
	
	// Use methods
	fmt.Printf("Document: %s\n", doc.Name)
	fmt.Printf("Active items: %d\n", len(doc.GetActiveItems()))
	fmt.Printf("Total price: $%.2f\n", doc.GetTotalPrice())
	fmt.Printf("Document: %s\n", doc.String())
}



