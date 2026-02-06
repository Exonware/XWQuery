#!/usr/bin/env python3
"""
xwlazy Integration with xwdata

This example demonstrates how xwlazy enables lazy loading of format converters
and optional data processing libraries in xwdata.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

from xwlazy.lazy import config_package_lazy_install_enabled
import json

# Configure xwlazy for xwdata
config_package_lazy_install_enabled("xwdata", enabled=True, mode="smart")

print("=" * 80)
print("xwlazy + xwdata Integration Example")
print("=" * 80)

# Import xwdata - format libraries will be auto-installed if needed
try:
    from exonware.xwdata import DataEngine, FormatConverter
    
    print("\n✅ xwdata imported successfully")
    print("   Format converters will be auto-installed when needed")
    
    # Create data engine
    print("\n📊 Creating data engine...")
    engine = DataEngine()
    
    # Sample data
    sample_data = {
        "users": [
            {"id": 1, "name": "Alice", "email": "alice@example.com"},
            {"id": 2, "name": "Bob", "email": "bob@example.com"},
        ],
        "metadata": {
            "version": "1.0",
            "timestamp": "2025-01-01T00:00:00Z"
        }
    }
    
    # Format conversion with lazy dependencies
    print("\n🔄 Format conversion examples...")
    
    # JSON (always available)
    json_data = json.dumps(sample_data)
    print("   ✅ JSON format (built-in)")
    
    # YAML conversion (will auto-install PyYAML if needed)
    try:
        converter = FormatConverter()
        yaml_data = converter.convert(json_data, "json", "yaml")
        print("   ✅ YAML format (auto-installed if needed)")
    except Exception as e:
        print(f"   ⚠️  YAML conversion: {e}")
    
    # CSV conversion (will auto-install pandas if needed)
    try:
        csv_data = converter.convert(json_data, "json", "csv")
        print("   ✅ CSV format (auto-installed if needed)")
    except Exception as e:
        print(f"   ⚠️  CSV conversion: {e}")
    
    # Multi-source merging with optional formats
    print("\n🔀 Multi-source merging...")
    sources = [
        {"format": "json", "data": json_data},
        # Additional sources with optional formats
    ]
    
    try:
        merged = engine.merge_sources(sources)
        print("   ✅ Multi-source merge completed")
    except Exception as e:
        print(f"   ⚠️  Merge operation: {e}")
    
    # Async operations with lazy loading
    print("\n⚡ Async operations...")
    print("   Async operations benefit from lazy loading:")
    print("   - Only load required formats")
    print("   - Install dependencies on-demand")
    print("   - Reduce memory footprint")
    
    # Benefits
    print("\n💡 Benefits of xwlazy with xwdata:")
    print("   - Format-agnostic operations")
    print("   - Optional format support")
    print("   - Reduced installation size")
    print("   - Faster startup time")
    print("   - On-demand dependency installation")
    
except ImportError as e:
    print(f"\n❌ Error importing xwdata: {e}")
    print("   Make sure xwdata is installed: pip install exonware-xwdata")
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "=" * 80)
print("Integration complete!")
print("=" * 80)
