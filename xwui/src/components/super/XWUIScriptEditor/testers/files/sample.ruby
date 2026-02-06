# Ruby Example
# Comprehensive Ruby code demonstrating various features

require 'json'
require 'date'

# Metadata class
class Metadata
  attr_accessor :author, :created, :tags
  
  def initialize
    @author = "XWUI Team"
    @created = DateTime.now.iso8601
    @tags = ["example", "ruby"]
  end
end

# Item class
class Item
  attr_accessor :id, :name, :active, :price, :categories
  
  def initialize(id, name, active, price, categories = [])
    @id = id
    @name = name
    @active = active
    @price = price
    @categories = categories
  end
end

# Document class
class Document
  attr_accessor :name, :version, :description, :metadata, :items
  
  def initialize(name, version, description)
    @name = name
    @version = version
    @description = description
    @metadata = Metadata.new
    @items = []
  end
  
  def add_item(item)
    @items << item
  end
  
  def get_active_items
    @items.select { |item| item.active }
  end
  
  def get_total_price
    get_active_items.sum { |item| item.price }
  end
  
  def to_json
    {
      name: @name,
      version: @version,
      description: @description,
      metadata: {
        author: @metadata.author,
        created: @metadata.created,
        tags: @metadata.tags
      },
      items: @items.map { |item|
        {
          id: item.id,
          name: item.name,
          active: item.active,
          price: item.price,
          categories: item.categories
        }
      }
    }.to_json
  end
end

# Example usage
doc = Document.new(
  "Sample Ruby Document",
  "1.0.0",
  "Ruby code example"
)

doc.add_item(Item.new(
  1,
  "First Item",
  true,
  29.99,
  ["electronics", "gadgets"]
))

doc.add_item(Item.new(
  2,
  "Second Item",
  false,
  49.99,
  ["books", "education"]
))

puts "Document: #{doc.name}"
puts "Active items: #{doc.get_active_items.length}"
puts "Total price: $#{'%.2f' % doc.get_total_price}"
puts "\nJSON:\n#{JSON.pretty_generate(JSON.parse(doc.to_json))}"

