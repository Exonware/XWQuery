# jq Query Examples (JSON processor)

# Basic selection
.name
.version
.metadata.author

# Array operations
.items[]
.items[0]
.items[0:2]
.items[-1]

# Object operations
.items[] | {name, price}
.items[] | select(.active == true)
.items[] | select(.price > 20)

# Filtering
.items[] | select(.active == true and .price > 20)
.items[] | select(.categories[] == "electronics")

# Transformations
.items[] | {name, price, discounted_price: (.price * 0.9)}
.items | map(select(.active)) | map(.price) | add

# Aggregations
.items | length
.items | map(.price) | add
.items | map(.price) | add / length
.items | map(select(.active)) | length

# Complex queries
.items[] | select(.active) | {name, price, category: .categories[0]}
.items | group_by(.categories[0]) | map({category: .[0].categories[0], items: map(.name), total: map(.price) | add})

# Multiple outputs
.items[] | "\(.name): $\(.price)"
.items[] | "\(.name) is \(if .active then "active" else "inactive" end)"

# Input file processing
# jq '.items[] | select(.active)' input.json
# jq -r '.items[] | "\(.name),\(.price)"' input.json

# Combining with other tools
# cat input.json | jq '.items[] | select(.price > 30)'
# curl -s https://api.example.com/data | jq '.results[] | {name, value}'



