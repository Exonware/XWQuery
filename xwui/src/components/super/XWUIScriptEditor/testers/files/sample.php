<?php
/**
 * PHP Example
 * Comprehensive PHP code demonstrating various features
 */

class Metadata {
    public $author;
    public $created;
    public $tags;
    
    public function __construct() {
        $this->author = "XWUI Team";
        $this->created = date('c');
        $this->tags = ["example", "php"];
    }
}

class Item {
    public $id;
    public $name;
    public $active;
    public $price;
    public $categories;
    
    public function __construct($id, $name, $active, $price, $categories = []) {
        $this->id = $id;
        $this->name = $name;
        $this->active = $active;
        $this->price = $price;
        $this->categories = $categories;
    }
}

class Document {
    private $name;
    private $version;
    private $description;
    private $metadata;
    private $items;
    
    public function __construct($name, $version, $description) {
        $this->name = $name;
        $this->version = $version;
        $this->description = $description;
        $this->metadata = new Metadata();
        $this->items = [];
    }
    
    public function addItem($item) {
        $this->items[] = $item;
    }
    
    public function getActiveItems() {
        return array_filter($this->items, function($item) {
            return $item->active;
        });
    }
    
    public function getTotalPrice() {
        $total = 0.0;
        foreach ($this->getActiveItems() as $item) {
            $total += $item->price;
        }
        return $total;
    }
    
    public function toJSON() {
        return json_encode([
            'name' => $this->name,
            'version' => $this->version,
            'description' => $this->description,
            'metadata' => [
                'author' => $this->metadata->author,
                'created' => $this->metadata->created,
                'tags' => $this->metadata->tags
            ],
            'items' => array_map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'active' => $item->active,
                    'price' => $item->price,
                    'categories' => $item->categories
                ];
            }, $this->items)
        ], JSON_PRETTY_PRINT);
    }
}

// Example usage
$doc = new Document(
    "Sample PHP Document",
    "1.0.0",
    "PHP code example"
);

$doc->addItem(new Item(
    1,
    "First Item",
    true,
    29.99,
    ["electronics", "gadgets"]
));

$doc->addItem(new Item(
    2,
    "Second Item",
    false,
    49.99,
    ["books", "education"]
));

echo "Document: " . $doc->name . "\n";
echo "Active items: " . count($doc->getActiveItems()) . "\n";
echo "Total price: $" . number_format($doc->getTotalPrice(), 2) . "\n";
echo "\nJSON:\n" . $doc->toJSON() . "\n";

