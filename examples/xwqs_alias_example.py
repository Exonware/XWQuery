#!/usr/bin/env python3
"""
XWQS Alias Example - Demonstrates using xwqs as the handler/strategy name
xwqs = XWQSStrategy - A convenient alias for the XWQS handler/strategy.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""

from exonware.xwquery import XWQSStrategy as xwqs
print("=" * 70)
print("XWQS Alias Example - Using xwqs as handler/strategy name")
print("=" * 70)
# Example 1: Create strategy instance using xwqs
print("\n1. Creating XWQueryScriptStrategy using xwqs alias:")
strategy = xwqs()
print(f"   Strategy type: {type(strategy).__name__}")
print(f"   Strategy class: {xwqs.__name__}")
# Example 2: Parse a query using xwqs
print("\n2. Parsing a query using xwqs:")
query = "SELECT name, age FROM users WHERE age > 25"
strategy = xwqs()
parsed = strategy.parse_script(query)
print(f"   Query: {query}")
print(f"   Parsed successfully: {parsed is not None}")
print(f"   Actions tree: {parsed._actions_tree is not None}")
# Example 3: Convert from SQL using xwqs
print("\n3. Converting SQL to XWQueryScript using xwqs:")
sql_query = "SELECT name FROM users WHERE age > 25"
strategy = xwqs()
converted = strategy.from_format(sql_query, 'sql')
print(f"   SQL Query: {sql_query}")
print(f"   Converted to XWQueryScript: {converted is not None}")
# Example 4: Using xwqs as a class reference
print("\n4. Using xwqs as a class reference:")
# Create multiple instances
strategy1 = xwqs()
strategy2 = xwqs()
print(f"   Strategy 1 type: {type(strategy1).__name__}")
print(f"   Strategy 2 type: {type(strategy2).__name__}")
print(f"   Both are XWQSStrategy: {isinstance(strategy1, xwqs)}")
# Example 5: Import patterns
print("\n5. Import patterns:")
print("   from exonware.xwquery import xwqs")
print("   from exonware.xwquery import XWQSStrategy")
print("   # Both are equivalent:")
print("   strategy = xwqs()")
print("   strategy = XWQSStrategy()")
print("\n" + "=" * 70)
print("Key Points:")
print("- xwqs is a convenient alias for XWQSStrategy")
print("- Use xwqs() to create a new strategy instance")
print("- xwqs is the handler/strategy name for XWQS")
print("- Both 'xwqs' and 'XWQSStrategy' refer to the same class")
print("=" * 70)
