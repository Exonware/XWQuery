// Scala Example
// Comprehensive Scala code demonstrating various features

import java.time.Instant
import scala.util.{Try, Success, Failure}

// Case classes
case class Metadata(
  author: String = "XWUI Team",
  created: String = Instant.now().toString,
  tags: List[String] = List("example", "scala")
)

case class Item(
  id: Int,
  name: String,
  active: Boolean,
  price: Double,
  categories: List[String] = Nil
)

// Document class
class Document(
  val name: String,
  val version: String,
  val description: String
) {
  private val metadata = Metadata()
  private var items: List[Item] = Nil
  
  def addItem(item: Item): Unit = {
    items = items :+ item
  }
  
  def getActiveItems: List[Item] = {
    items.filter(_.active)
  }
  
  def getTotalPrice: Double = {
    getActiveItems.map(_.price).sum
  }
  
  def toJSON: String = {
    import org.json4s._
    import org.json4s.jackson.JsonMethods._
    implicit val formats = DefaultFormats
    
    val json = Map(
      "name" -> name,
      "version" -> version,
      "description" -> description,
      "metadata" -> Map(
        "author" -> metadata.author,
        "created" -> metadata.created,
        "tags" -> metadata.tags
      ),
      "items" -> items.map(item => Map(
        "id" -> item.id,
        "name" -> item.name,
        "active" -> item.active,
        "price" -> item.price,
        "categories" -> item.categories
      ))
    )
    
    pretty(render(json))
  }
}

// Companion object
object Document {
  def apply(name: String, version: String, description: String): Document = {
    new Document(name, version, description)
  }
}

// Main object
object Main extends App {
  val doc = Document(
    "Sample Scala Document",
    "1.0.0",
    "Scala code example"
  )
  
  doc.addItem(Item(
    id = 1,
    name = "First Item",
    active = true,
    price = 29.99,
    categories = List("electronics", "gadgets")
  ))
  
  doc.addItem(Item(
    id = 2,
    name = "Second Item",
    active = false,
    price = 49.99,
    categories = List("books", "education")
  ))
  
  println(s"Document: ${doc.name}")
  println(s"Active items: ${doc.getActiveItems.length}")
  println(f"Total price: $${doc.getTotalPrice}%.2f")
  println(s"\nJSON:\n${doc.toJSON}")
}

