(: XQuery Examples :)
(: XQuery is a functional programming language for XML :)

(: Basic query :)
for $book in doc("books.xml")/bookstore/book
where $book/price > 30
return $book/title

(: FLWOR expression :)
for $book in doc("books.xml")/bookstore/book
let $discount := $book/price * 0.9
where $book/price > 35
order by $book/title
return <discounted-book>
  {$book/title}
  <original-price>{$book/price}</original-price>
  <discounted-price>{$discount}</discounted-price>
</discounted-book>

(: Conditional expressions :)
for $book in doc("books.xml")/bookstore/book
return if ($book/@category = "fiction")
  then <fiction>{$book/title}</fiction>
  else <non-fiction>{$book/title}</non-fiction>

(: Functions :)
declare function local:discount($price as xs:decimal) as xs:decimal {
  $price * 0.9
};

for $book in doc("books.xml")/bookstore/book
return <book>
  {$book/title}
  <discounted-price>{local:discount($book/price)}</discounted-price>
</book>

(: Aggregations :)
<stats>
  <total-books>{count(doc("books.xml")/bookstore/book)}</total-books>
  <avg-price>{avg(doc("books.xml")/bookstore/book/price)}</avg-price>
  <max-price>{max(doc("books.xml")/bookstore/book/price)}</max-price>
</stats>

(: Joins :)
for $book in doc("books.xml")/bookstore/book,
    $author in doc("authors.xml")/authors/author
where $book/author = $author/name
return <book-author>
  {$book/title}
  {$author/bio}
</book-author>

