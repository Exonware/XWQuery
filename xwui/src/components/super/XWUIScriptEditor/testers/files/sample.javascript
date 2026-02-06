// JavaScript Example
// Comprehensive JavaScript code demonstrating various features

class Document {
    constructor(name, version, description) {
        this.name = name;
        this.version = version;
        this.description = description;
        this.metadata = {
            author: 'XWUI Team',
            created: new Date().toISOString(),
            tags: ['example', 'javascript', 'es6']
        };
        this.items = [];
    }
    
    addItem(item) {
        this.items.push(item);
    }
    
    getActiveItems() {
        return this.items.filter(item => item.active);
    }
    
    getTotalPrice() {
        return this.getActiveItems()
            .reduce((sum, item) => sum + item.price, 0);
    }
    
    toJSON() {
        return JSON.stringify({
            name: this.name,
            version: this.version,
            description: this.description,
            metadata: this.metadata,
            items: this.items
        }, null, 2);
    }
}

// Example usage
const doc = new Document(
    'Sample JavaScript Document',
    '1.0.0',
    'JavaScript code example'
);

doc.addItem({
    id: 1,
    name: 'First Item',
    active: true,
    price: 29.99,
    categories: ['electronics', 'gadgets']
});

doc.addItem({
    id: 2,
    name: 'Second Item',
    active: false,
    price: 49.99,
    categories: ['books', 'education']
});

// Use async/await
async function processDocument(doc) {
    const activeItems = doc.getActiveItems();
    const total = doc.getTotalPrice();
    
    console.log(`Document: ${doc.name}`);
    console.log(`Active items: ${activeItems.length}`);
    console.log(`Total price: $${total.toFixed(2)}`);
    
    return {
        name: doc.name,
        activeCount: activeItems.length,
        totalPrice: total
    };
}

// Arrow functions and destructuring
const processItem = ({ id, name, price }) => {
    return `${name} (ID: ${id}) - $${price}`;
};

// Array methods
const itemNames = doc.items.map(item => item.name);
const expensiveItems = doc.items.filter(item => item.price > 30);
const totalValue = doc.items.reduce((sum, item) => sum + item.price, 0);

// Promises
const fetchData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(doc.toJSON());
        }, 1000);
    });
};

// Export for modules
export { Document, processDocument, processItem };

