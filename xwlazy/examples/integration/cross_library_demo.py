#!/usr/bin/env python3
"""
Cross-Library Integration Demo with xwlazy

This example demonstrates a complete application using xwlazy with multiple
xw libraries, showing production deployment patterns and security policies.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

from xwlazy.lazy import (
    config_package_lazy_install_enabled,
    set_package_allow_list,
    get_lazy_install_stats,
)

print("=" * 80)
print("Cross-Library Integration Demo with xwlazy")
print("=" * 80)

# Configure xwlazy for multiple packages
print("\n🔧 Configuring xwlazy for multiple packages...")

# xwsystem - smart mode (on-demand installation)
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
print("   ✅ xwsystem: smart mode (on-demand installation)")

# xwnode - lite mode (lazy loading only, no auto-install)
config_package_lazy_install_enabled("xwnode", enabled=True, mode="lite")
print("   ✅ xwnode: lite mode (lazy loading only)")

# xwdata - smart mode with allow list
config_package_lazy_install_enabled("xwdata", enabled=True, mode="smart")
set_package_allow_list("xwdata", ["PyYAML", "pandas", "openpyxl"])
print("   ✅ xwdata: smart mode with allow list")

# xwquery - warn mode (monitoring, no installation)
config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")
print("   ✅ xwquery: warn mode (monitoring only)")

# Production deployment pattern
print("\n🏭 Production Deployment Pattern:")
print("   - xwsystem: Auto-install for core functionality")
print("   - xwnode: Lazy load only (dependencies pre-installed)")
print("   - xwdata: Controlled auto-install with allow list")
print("   - xwquery: Monitor only (security policy)")

# Security policy configuration
print("\n🔒 Security Policy Configuration:")
print("   - Allow list for xwdata: PyYAML, pandas, openpyxl")
print("   - Other packages blocked from auto-installation")
print("   - xwquery in warn mode: logs but doesn't install")

# Application workflow
print("\n📊 Application Workflow:")

try:
    # Step 1: Import xwsystem (auto-installs if needed)
    from exonware.xwsystem import JsonSerializer, YamlSerializer
    print("   ✅ Step 1: xwsystem imported (dependencies auto-installed if needed)")
    
    # Step 2: Use serialization
    data = {"message": "Hello from cross-library demo"}
    json_ser = JsonSerializer()
    json_data = json_ser.dumps(data)
    print("   ✅ Step 2: JSON serialization completed")
    
    # Step 3: Import xwnode (lazy load, no auto-install)
    try:
        from exonware.xwnode import Node, Graph
        print("   ✅ Step 3: xwnode imported (lazy loaded)")
        
        graph = Graph()
        node = Node(data={"id": 1, "name": "Test"})
        graph.add_node(node)
        print("   ✅ Step 4: Graph operations completed")
    except ImportError:
        print("   ⚠️  Step 3: xwnode dependencies not installed (lite mode)")
    
    # Step 4: Import xwdata (controlled auto-install)
    try:
        from exonware.xwdata import DataEngine
        print("   ✅ Step 5: xwdata imported (dependencies from allow list)")
        
        engine = DataEngine()
        print("   ✅ Step 6: Data engine created")
    except ImportError:
        print("   ⚠️  Step 5: xwdata dependencies not available")
    
    # Step 5: Import xwquery (warn mode)
    try:
        from exonware.xwquery import QueryEngine
        print("   ✅ Step 7: xwquery imported (warn mode - no auto-install)")
    except ImportError:
        print("   ⚠️  Step 7: xwquery dependencies not installed (warn mode)")
    
except Exception as e:
    print(f"   ❌ Error: {e}")

# Statistics
print("\n📈 Installation Statistics:")
try:
    stats_xwsystem = get_lazy_install_stats("xwsystem")
    print(f"   xwsystem: {stats_xwsystem.get('total_installed', 0)} packages installed")
    
    stats_xwdata = get_lazy_install_stats("xwdata")
    print(f"   xwdata: {stats_xwdata.get('total_installed', 0)} packages installed")
except Exception as e:
    print(f"   ⚠️  Could not retrieve statistics: {e}")

# Best practices
print("\n💡 Best Practices Demonstrated:")
print("   ✅ Per-package isolation (each package has its own policy)")
print("   ✅ Security policies (allow lists, warn mode)")
print("   ✅ Mode selection (smart, lite, warn)")
print("   ✅ Production-ready configuration")
print("   ✅ Monitoring and statistics")

print("\n" + "=" * 80)
print("Cross-library integration complete!")
print("=" * 80)
print("\nThis demo shows how xwlazy enables:")
print("  - Flexible dependency management")
print("  - Security-controlled environments")
print("  - Production deployment patterns")
print("  - Per-package isolation")
