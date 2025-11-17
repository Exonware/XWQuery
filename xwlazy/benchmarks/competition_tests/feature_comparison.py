#!/usr/bin/env python3
"""
#xwlazy/benchmarks/competition_tests/feature_comparison.py

Feature comparison script for lazy import libraries.

Tests and compares available features across different libraries.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.0.0
Generation Date: 17-Nov-2025
"""

import sys
import io
import importlib
import json
from pathlib import Path
from typing import Dict, List, Set
from datetime import datetime

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from library_adapters import create_adapter, LibraryAdapter


def test_feature(adapter: LibraryAdapter, feature_name: str) -> bool:
    """Test if a specific feature is available."""
    features = adapter.get_features()
    return feature_name in features


def compare_features() -> Dict[str, Dict[str, bool]]:
    """Compare features across all libraries."""
    libraries = [
        "xwlazy",
        "pipimport",
        "deferred-import",
        "lazy-loader",
        "lazy-imports",
        "lazy_import",
        "pylazyimports",
        "lazi",
        "lazy-imports-lite",
    ]

    features_to_test = [
        "lazy_import",
        "auto_install",
        "deferred_loading",
        "caching",
        "keyword_detection",
        "per_package_isolation",
        "performance_monitoring",
        "thread_safety",
        "circular_dependency_handling",
    ]

    results = {}

    for library_name in libraries:
        print(f"\nTesting {library_name}...")
        try:
            adapter = create_adapter(library_name)
            if adapter is None:
                print(f"  ❌ Cannot create adapter (library not installed?)")
                results[library_name] = {f: False for f in features_to_test}
                continue

            library_results = {}
            for feature in features_to_test:
                supported = test_feature(adapter, feature)
                library_results[feature] = supported
                status = "✅" if supported else "❌"
                print(f"  {status} {feature}")

            results[library_name] = library_results

        except Exception as e:
            print(f"  ❌ Error: {e}")
            results[library_name] = {f: False for f in features_to_test}

    return results


def _generate_benchmark_filename(description: str = "FEATURES") -> str:
    """Generate benchmark filename following GUIDE_DOCS.md naming convention.
    
    Format: BENCH_YYYYMMDD_HHMM_DESCRIPTION
    Why: Follows eXonware documentation standards for benchmark logs.
    """
    now = datetime.now()
    date_str = now.strftime("%Y%m%d")
    time_str = now.strftime("%H%M")
    return f"BENCH_{date_str}_{time_str}_{description}"


def generate_feature_report(results: Dict[str, Dict[str, bool]]):
    """Generate a markdown report of feature comparison."""
    filename = f"{_generate_benchmark_filename('FEATURES')}.md"
    report_path = Path(__file__).parent / "output_log" / filename
    report_path.parent.mkdir(exist_ok=True)

    features = list(next(iter(results.values())).keys()) if results else []

    with open(report_path, "w", encoding='utf-8') as f:
        f.write("# Feature Comparison Report\n\n")
        f.write(f"**Generated:** {datetime.now().isoformat()}\n\n")

        # Feature matrix
        f.write("## Feature Matrix\n\n")
        f.write("| Feature | " + " | ".join(results.keys()) + " |\n")
        f.write("|" + "|".join(["---"] * (len(results) + 1)) + "|\n")

        for feature in features:
            row = [feature]
            for library in results.keys():
                status = "✅" if results[library].get(feature, False) else "❌"
                row.append(status)
            f.write("| " + " | ".join(row) + " |\n")

        # Summary
        f.write("\n## Summary\n\n")
        for library, lib_features in results.items():
            supported = sum(1 for v in lib_features.values() if v)
            total = len(lib_features)
            f.write(f"- **{library}**: {supported}/{total} features supported\n")

    print(f"\n📊 Feature report saved to: {report_path}")


def main():
    print("=" * 80)
    print("Feature Comparison: Lazy Import Libraries")
    print("=" * 80)

    results = compare_features()
    generate_feature_report(results)

    # Save JSON
    filename = f"{_generate_benchmark_filename('FEATURES')}.json"
    json_path = Path(__file__).parent / "output_log" / filename
    json_path.parent.mkdir(exist_ok=True)
    with open(json_path, "w", encoding='utf-8') as f:
        json.dump(results, f, indent=2)

    print(f"💾 JSON results saved to: {json_path}")


if __name__ == "__main__":
    main()

