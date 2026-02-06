# Sample Markdown Document

**Version:** 1.0.0  
**Author:** XWUI Team  
**Created:** 2025-01-15

This is a comprehensive Markdown example demonstrating various Markdown features.

## Overview

This document demonstrates:

- Headers and text formatting
- Lists (ordered and unordered)
- Code blocks
- Links and images
- Tables
- Blockquotes
- And more!

## Text Formatting

This is **bold text** and this is *italic text*. You can also use ***bold and italic*** together.

Here's some `inline code` and here's a [link to example.com](https://example.com).

## Lists

### Unordered List

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered List

1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item

## Code Blocks

### JavaScript

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('World'));
```

### Python

```python
def calculate_total(items):
    return sum(item.price for item in items if item.active)

items = [
    {'name': 'Item 1', 'price': 29.99, 'active': True},
    {'name': 'Item 2', 'price': 49.99, 'active': False}
]

total = calculate_total(items)
print(f"Total: ${total:.2f}")
```

## Tables

| Item ID | Name | Status | Price |
|---------|------|--------|-------|
| 1 | First Item | Active | $29.99 |
| 2 | Second Item | Inactive | $49.99 |
| 3 | Third Item | Active | $19.99 |

## Blockquotes

> This is a blockquote. It can contain multiple paragraphs.
>
> This is the second paragraph in the blockquote.

> Another blockquote with **bold text** and `code`.

## Horizontal Rule

---

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Another incomplete task

## Links and Images

[Markdown Guide](https://www.markdownguide.org/)

![Sample Image](https://via.placeholder.com/400x200)

## Math (if supported)

Inline math: $E = mc^2$

Block math:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

