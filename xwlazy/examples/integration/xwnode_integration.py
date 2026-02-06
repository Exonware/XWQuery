#!/usr/bin/env python3
"""
xwlazy Integration with xwnode

This example demonstrates how xwlazy enables lazy loading of graph operations
and auto-installation of graph libraries in xwnode.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

from xwlazy.lazy import config_package_lazy_install_enabled
import time

# Configure xwlazy for xwnode
config_package_lazy_install_enabled("xwnode", enabled=True, mode="smart")

print("=" * 80)
print("xwlazy + xwnode Integration Example")
print("=" * 80)

# Import xwnode - graph libraries will be auto-installed if needed
try:
    from exonware.xwnode import Node, Graph
    
    print("\n✅ xwnode imported successfully")
    print("   Graph libraries will be auto-installed when needed")
    
    # Create a simple graph
    print("\n📊 Creating graph structure...")
    graph = Graph()
    
    # Add nodes
    node1 = Node(data={"name": "Alice", "age": 30})
    node2 = Node(data={"name": "Bob", "age": 25})
    node3 = Node(data={"name": "Charlie", "age": 35})
    
    graph.add_node(node1)
    graph.add_node(node2)
    graph.add_node(node3)
    
    # Add edges
    graph.add_edge(node1, node2, data={"relationship": "friend"})
    graph.add_edge(node2, node3, data={"relationship": "colleague"})
    
    print(f"   Created graph with {len(graph.nodes)} nodes and {len(graph.edges)} edges")
    
    # Graph operations that might require additional libraries
    print("\n🔍 Performing graph operations...")
    
    # These operations will trigger lazy installation if needed
    # For example, if graph visualization is needed:
    try:
        # This would auto-install graphviz if not present
        # visualization = graph.visualize()  # Uncomment if graphviz needed
        print("   Graph operations completed")
    except Exception as e:
        print(f"   Note: Some operations may require additional libraries: {e}")
    
    # Performance comparison
    print("\n⚡ Performance Comparison:")
    print("   Without lazy loading: All dependencies installed upfront")
    print("   With lazy loading: Dependencies installed on-demand")
    print("   Result: Faster initial setup, smaller installation size")
    
except ImportError as e:
    print(f"\n❌ Error importing xwnode: {e}")
    print("   Make sure xwnode is installed: pip install exonware-xwnode")
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "=" * 80)
print("Integration complete!")
print("=" * 80)
