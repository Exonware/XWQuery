#!/usr/bin/env python3
"""
Sync xwlazy_external_libs.toml with top 5000 PyPI packages + all xw* library dependencies.

- Fetches top 5000 from hugovk/top-pypi-packages (30-day JSON).
- Extracts all dependencies from xw* libraries (requirements.txt and pyproject.toml).
- Ensures all are present (as import_name -> package_name).
- Reports duplicate keys (same key in deny_list and mappings).

Naming (important):
- KEY  = import name (what you use in Python: "import key" or "from key import ...").
         Must be a valid Python identifier (underscores ok, hyphens not).
- VALUE = PyPI distribution name (what you pass to "pip install <value>").
          PyPI allows hyphens (e.g. typing-extensions, scikit-learn).

We derive the import name from the PyPI name by replacing "-" with "_". That matches
the common convention (PEP 8: import names use underscores; PyPI names often use
hyphens for the same word). It does NOT match when the project chose a different
import name (e.g. scikit-learn -> sklearn, PyYAML -> yaml); those are already
mapped manually in the TOML, so they are "covered" and we do not add a second mapping.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.request import urlopen

TOML_PATH = Path(__file__).resolve().parent.parent / "src" / "exonware" / "xwlazy_external_libs.toml"
TOP500_URL = "https://raw.githubusercontent.com/hugovk/top-pypi-packages/main/top-pypi-packages-30-days.json"
TOP_N = 5000
REPO_ROOT = Path(__file__).resolve().parent.parent.parent

# PyPI package name -> import name(s). When the real import differs from pkg.replace("-", "_"),
# list the actual import name(s). We will NOT auto-add these (they should be in the TOML already).
# Only add here if we discover a top-500 package whose import name we know and isn't in the TOML.
IMPORT_NAME_OVERRIDES: dict[str, list[str]] = {
    # e.g. "scikit-learn": ["sklearn"],  # already in TOML
    # "PyYAML": ["yaml"],  # already in TOML
}


def fetch_top_packages(n: int = TOP_N) -> list[str]:
    with urlopen(TOP500_URL, timeout=30) as r:
        data = json.load(r)
    rows = data.get("rows", [])
    return [row["project"] for row in rows[:n]]


def normalize_pypi(name: str) -> str:
    """PyPI names are case-insensitive; normalize to lowercase for comparison."""
    return name.lower().replace("_", "-")


def parse_toml_mappings(content: str) -> tuple[dict[str, str], dict[str, str], set[str]]:
    """
    Parse TOML and return:
    - deny_list: key -> value
    - mappings: key -> package_name
    - all package names (values) in mappings, normalized
    """
    deny_list: dict[str, str] = {}
    mappings: dict[str, str] = {}
    in_deny = False
    in_mappings = False
    packages = set()

    for line in content.splitlines():
        line_stripped = line.strip()
        if line_stripped == "[deny_list]":
            in_deny = True
            in_mappings = False
            continue
        if line_stripped == "[mappings]":
            in_mappings = True
            in_deny = False
            continue
        if line_stripped.startswith("["):
            in_deny = in_mappings = False
            continue
        m = re.match(r'"([^"]+)"\s*=\s*"([^"]*)"', line)
        if not m:
            continue
        key, val = m.group(1), m.group(2)
        if in_deny:
            deny_list[key] = val
        elif in_mappings:
            mappings[key] = val
            packages.add(normalize_pypi(val))

    return deny_list, mappings, packages


def find_duplicate_keys(deny_list: dict[str, str], mappings: dict[str, str]) -> list[tuple[str, str, str]]:
    """Find keys that appear in both deny_list and mappings, or any key appearing twice in mappings."""
    duplicates: list[tuple[str, str, str]] = []
    for k in deny_list:
        if k in mappings:
            duplicates.append((k, "in both deny_list and mappings", f"deny={deny_list[k][:40]}... | map->{mappings[k]}"))
    # In TOML, same key twice in same table = last wins; we already have single dict for mappings, so no duplicate keys in mappings
    return duplicates


def extract_package_name(dep: str) -> str:
    """Extract package name from dependency string (removes version constraints, extras, comments)."""
    # Remove comments
    dep = dep.split("#")[0].strip()
    if not dep:
        return ""
    # Remove version constraints (>=, ==, <=, <, >, ~=, !=)
    dep = re.sub(r"[<>=!~]+.*$", "", dep).strip()
    # Remove extras [extra1,extra2]
    dep = re.sub(r"\[.*?\]", "", dep).strip()
    # Remove whitespace
    return dep.strip()


def find_xw_dependencies() -> set[str]:
    """Find all dependencies from xw* libraries (requirements.txt and pyproject.toml)."""
    deps = set()
    repo_root = REPO_ROOT
    
    # Find all xw* directories
    xw_dirs = [d for d in repo_root.iterdir() if d.is_dir() and d.name.startswith("xw")]
    
    print(f"\nScanning {len(xw_dirs)} xw* directories for dependencies...")
    
    for xw_dir in xw_dirs:
        # Check requirements.txt
        req_file = xw_dir / "requirements.txt"
        if req_file.exists():
            try:
                content = req_file.read_text(encoding="utf-8")
                for line in content.splitlines():
                    pkg = extract_package_name(line)
                    if pkg and not pkg.startswith("exonware-") and pkg not in ["", "setuptools", "wheel"]:
                        deps.add(pkg)
            except Exception as e:
                print(f"  Warning: Could not read {req_file}: {e}")
        
        # Check pyproject.toml
        pyproject_file = xw_dir / "pyproject.toml"
        if pyproject_file.exists():
            try:
                import tomllib
                content = pyproject_file.read_text(encoding="utf-8")
                # Simple regex-based parsing (avoiding full TOML parser dependency)
                # Look for dependencies = [...] or [project.optional-dependencies.*] = [...]
                in_deps_section = False
                for line in content.splitlines():
                    line_stripped = line.strip()
                    if line_stripped.startswith("dependencies") or "[project.optional-dependencies" in line_stripped:
                        in_deps_section = True
                        continue
                    if line_stripped.startswith("[") and not "[project.optional-dependencies" in line_stripped:
                        in_deps_section = False
                        continue
                    if in_deps_section:
                        # Extract quoted strings
                        for match in re.findall(r'"([^"]+)"', line):
                            pkg = extract_package_name(match)
                            if pkg and not pkg.startswith("exonware-") and pkg not in ["", "setuptools", "wheel"]:
                                deps.add(pkg)
            except Exception as e:
                print(f"  Warning: Could not parse {pyproject_file}: {e}")
    
    print(f"Found {len(deps)} unique dependencies from xw* libraries")
    return deps


def main() -> None:
    print("Fetching top", TOP_N, "PyPI packages...")
    top_packages = fetch_top_packages(TOP_N)
    print("Got", len(top_packages), "packages.")

    # Get xw* library dependencies
    xw_deps = find_xw_dependencies()

    content = TOML_PATH.read_text(encoding="utf-8")
    deny_list, mappings, covered = parse_toml_mappings(content)

    # Duplicates: key in both deny_list and mappings
    dups = find_duplicate_keys(deny_list, mappings)
    if dups:
        print("\n--- DUPLICATES (same key in deny_list and mappings) ---")
        for key, reason, detail in dups:
            print(f"  {key}: {reason}")
            print(f"    {detail}")
        print("You can: remove from [mappings] (keep blocked) or remove from [deny_list] (allow install).")

    # Missing: top-N packages not covered
    missing_top: list[str] = []
    for pkg in top_packages:
        norm = normalize_pypi(pkg)
        if norm not in covered:
            missing_top.append(pkg)

    # Missing: xw* dependencies not covered
    missing_xw: list[str] = []
    for pkg in xw_deps:
        norm = normalize_pypi(pkg)
        if norm not in covered:
            missing_xw.append(pkg)

    # Combine all missing packages
    all_missing = list(set(missing_top + missing_xw))
    
    if all_missing:
        print(f"\n--- MISSING PACKAGES ---")
        print(f"Top {TOP_N} packages missing: {len(missing_top)}")
        print(f"xw* library dependencies missing: {len(missing_xw)}")
        print(f"Total unique missing: {len(all_missing)}")
        if len(all_missing) <= 50:
            for p in sorted(all_missing, key=str.lower):
                print(" ", p)
        else:
            for p in sorted(all_missing, key=str.lower)[:50]:
                print(" ", p)
            print(" ... and", len(all_missing) - 50, "more.")
        
        print("\nAdding missing packages as self-mappings (import name = package name)...")
        # Skip packages whose key already exists (e.g. toml -> tomli, psycopg2 -> psycopg2-binary)
        existing_keys = set(mappings.keys())
        # Skip packages with known import-name overrides (real import differs from pkg.replace("-","_"))
        override_pkgs = {normalize_pypi(k) for k in IMPORT_NAME_OVERRIDES}
        to_add = [
            p
            for p in sorted(all_missing, key=str.lower)
            if p.replace("-", "_") not in existing_keys and normalize_pypi(p) not in override_pkgs
        ]
        if len(to_add) < len(all_missing):
            skipped = len(all_missing) - len(to_add)
            print("Skipped", skipped, "already have mapping key or in IMPORT_NAME_OVERRIDES (kept existing).")
        
        add_block = f"\n# Top {TOP_N} PyPI + xw* dependencies (additions). Key=import name, value=PyPI package name (- -> _ convention).\n"
        for pkg in to_add:
            # Convention: Python import uses underscores; PyPI uses hyphens. Same word -> replace - with _.
            import_name = pkg.replace("-", "_")
            add_block += f'"{import_name}" = "{pkg}"\n'
        if to_add:
            # Insert before last newline of file (or at end)
            if content.endswith("\n"):
                content = content.rstrip("\n") + add_block + "\n"
            else:
                content = content + add_block
            TOML_PATH.write_text(content, encoding="utf-8")
            print(f"Wrote {len(to_add)} new entries to {TOML_PATH}")
        else:
            print("No new entries to add (all missing already have keys).")
    else:
        print(f"\nAll top {TOP_N} packages and xw* dependencies are already covered in mappings.")

    # Also ensure no duplicate keys in the file (same key twice under [mappings])
    mapping_keys = list(mappings.keys())
    if len(mapping_keys) != len(set(mapping_keys)):
        seen = set()
        for k in mapping_keys:
            if k in seen:
                print("Duplicate key in [mappings]:", k)
            seen.add(k)

    sys.exit(0 if not dups else 1)


if __name__ == "__main__":
    main()
