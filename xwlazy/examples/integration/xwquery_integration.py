#!/usr/bin/env python3
"""
xwlazy Integration with xwquery

This example demonstrates how xwlazy enables lazy loading of query language
parsers and format converters in xwquery.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

from xwlazy.lazy import config_package_lazy_install_enabled

# Configure xwlazy for xwquery
config_package_lazy_install_enabled("xwquery", enabled=True, mode="smart")

print("=" * 80)
print("xwlazy + xwquery Integration Example")
print("=" * 80)

# Import xwquery - query parsers will be auto-installed if needed
try:
    from exonware.xwquery import QueryEngine, QueryParser
    
    print("\n✅ xwquery imported successfully")
    print("   Query language parsers will be auto-installed when needed")
    
    # Create query engine
    print("\n📊 Creating query engine...")
    engine = QueryEngine()
    
    # Sample data
    sample_data = {
        "users": [
            {"id": 1, "name": "Alice", "age": 30, "city": "New York"},
            {"id": 2, "name": "Bob", "age": 25, "city": "London"},
            {"id": 3, "name": "Charlie", "age": 35, "city": "Tokyo"},
        ]
    }
    
    # Query language parsing with lazy grammars
    print("\n🔍 Query language examples...")
    
    # SQL-like queries
    try:
        query = "SELECT name, age FROM users WHERE age > 28"
        result = engine.execute(query, sample_data)
        print(f"   ✅ SQL query executed: {len(result)} results")
    except Exception as e:
        print(f"   ⚠️  SQL query: {e}")
    
    # GraphQL queries (will auto-install graphql-core if needed)
    try:
        graphql_query = """
        {
            users(age: {gt: 28}) {
                name
                age
            }
        }
        """
        result = engine.execute(graphql_query, sample_data, format="graphql")
        print("   ✅ GraphQL query executed (auto-installed if needed)")
    except Exception as e:
        print(f"   ⚠️  GraphQL query: {e}")
    
    # Cypher queries (will auto-install neo4j driver if needed)
    try:
        cypher_query = "MATCH (u:User) WHERE u.age > 28 RETURN u.name, u.age"
        result = engine.execute(cypher_query, sample_data, format="cypher")
        print("   ✅ Cypher query executed (auto-installed if needed)")
    except Exception as e:
        print(f"   ⚠️  Cypher query: {e}")
    
    # Format converter lazy loading
    print("\n🔄 Format converter examples...")
    print("   Format converters are loaded on-demand:")
    print("   - SQL → JSON converter")
    print("   - GraphQL → JSON converter")
    print("   - Cypher → JSON converter")
    print("   - SPARQL → JSON converter")
    
    # Query optimization with optional dependencies
    print("\n⚡ Query optimization...")
    print("   Query optimization benefits from lazy loading:")
    print("   - Only load required optimizers")
    print("   - Install optimization libraries on-demand")
    print("   - Reduce memory usage")
    
    # Benefits
    print("\n💡 Benefits of xwlazy with xwquery:")
    print("   - Support for 35+ query languages")
    print("   - Optional query language parsers")
    print("   - Reduced installation size")
    print("   - Faster startup time")
    print("   - On-demand grammar loading")
    
except ImportError as e:
    print(f"\n❌ Error importing xwquery: {e}")
    print("   Make sure xwquery is installed: pip install exonware-xwquery")
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "=" * 80)
print("Integration complete!")
print("=" * 80)
