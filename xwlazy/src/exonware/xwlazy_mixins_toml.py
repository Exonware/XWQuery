"""
Fast TOML reader and writer — stdlib only, no tomli/tomllib.
Used internally by xwlazy for pyproject.toml, xwlazy_external_libs.toml,
lockfile, and SBOM. Line-oriented parsing for speed (inspired by JSONL).
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any, BinaryIO, TextIO, Union


# -----------------------------------------------------------------------------
# Reader: line-by-line, minimal allocations, no regex for key=value
# -----------------------------------------------------------------------------

def _get_table(root: dict, path: list[str]) -> dict:
    """Get or create nested dict at path (e.g. ['tool','hatch'] -> root['tool']['hatch'])."""
    d = root
    for key in path:
        d = d.setdefault(key, {})
    return d


def _ensure_list_at(root: dict, path: list[str]) -> list:
    """Get or create list at path; parent dicts created. Returns the list."""
    if not path:
        raise ValueError("path must not be empty for array of tables")
    d = root
    for key in path[:-1]:
        d = d.setdefault(key, {})
    key = path[-1]
    if key not in d:
        d[key] = []
    lst = d[key]
    if not isinstance(lst, list):
        raise ValueError(f"expected list at {path!r}, got {type(lst).__name__}")
    return lst


def _parse_value(val: str) -> Any:
    """Parse a single TOML value (string, number, bool, array, inline table)."""
    val = val.strip()
    if not val:
        return ""
    # String: "..." or '...'
    if val.startswith('"'):
        return _parse_basic_string(val)
    if val.startswith("'"):
        return _parse_literal_string(val)
    # Boolean
    if val == "true":
        return True
    if val == "false":
        return False
    # Array
    if val.startswith("["):
        return _parse_array(val)
    # Inline table
    if val.startswith("{"):
        return _parse_inline_table(val)
    # Integer / float
    try:
        if "." in val or "e" in val.lower():
            return float(val)
        return int(val)
    except ValueError:
        pass
    return val


def _parse_basic_string(s: str) -> str:
    """Parse "...\"...\"..." with \\ \" \\n \\t escapes."""
    if len(s) < 2 or s[0] != '"':
        return s
    out = []
    i = 1
    while i < len(s):
        if s[i] == '"':
            return "".join(out)
        if s[i] == "\\":
            i += 1
            if i >= len(s):
                break
            c = s[i]
            if c == "n":
                out.append("\n")
            elif c == "t":
                out.append("\t")
            elif c == "r":
                out.append("\r")
            elif c == '"' or c == "\\":
                out.append(c)
            else:
                out.append(c)
            i += 1
            continue
        out.append(s[i])
        i += 1
    return "".join(out)


def _parse_literal_string(s: str) -> str:
    """Parse '...' (no escapes)."""
    if len(s) < 2 or s[0] != "'":
        return s
    end = s.find("'", 1)
    if end == -1:
        return s[1:]
    return s[1:end]


def _parse_array(s: str) -> list:
    """Parse [v1, v2, ...] — values can be strings, numbers, bools, nested arrays/tables."""
    s = s.strip()
    if not s.startswith("["):
        return []
    out = []
    i = 1
    while i < len(s):
        while i < len(s) and s[i] in " \t\n\r,":
            i += 1
        if i >= len(s):
            break
        if s[i] == "]":
            return out
        # Find end of this value (respect quotes and brackets)
        start = i
        if s[i] == '"':
            i += 1
            while i < len(s):
                if s[i] == "\\":
                    i += 2
                    continue
                if s[i] == '"':
                    i += 1
                    break
                i += 1
        elif s[i] == "'":
            i = s.find("'", i + 1) + 1
            if i == 0:
                i = len(s)
        elif s[i] == "[":
            depth = 1
            i += 1
            while i < len(s) and depth:
                if s[i] == "[":
                    depth += 1
                elif s[i] == "]":
                    depth -= 1
                i += 1
        elif s[i] == "{":
            depth = 1
            i += 1
            while i < len(s) and depth:
                if s[i] == "{":
                    depth += 1
                elif s[i] == "}":
                    depth -= 1
                i += 1
        else:
            while i < len(s) and s[i] not in ",]":
                i += 1
        chunk = s[start:i].strip()
        if chunk:
            out.append(_parse_value(chunk))
    return out


def _parse_inline_table(s: str) -> dict:
    """Parse { k = v, ... }."""
    s = s.strip()
    if not s.startswith("{"):
        return {}
    out = {}
    i = 1
    while i < len(s):
        while i < len(s) and s[i] in " \t,":
            i += 1
        if i >= len(s) or s[i] == "}":
            break
        eq = s.find("=", i)
        if eq == -1:
            break
        key = s[i:eq].strip().strip('"').strip("'")
        i = eq + 1
        # Find value end (respect quotes and brackets)
        while i < len(s) and s[i] in " \t":
            i += 1
        if i >= len(s):
            break
        start = i
        if s[i] == '"':
            i += 1
            while i < len(s):
                if s[i] == "\\":
                    i += 2
                    continue
                if s[i] == '"':
                    i += 1
                    break
                i += 1
        elif s[i] == "'":
            i = s.find("'", i + 1) + 1
            if i == 0:
                i = len(s)
        elif s[i] in "[{":
            close = "]" if s[i] == "[" else "}"
            depth = 1
            i += 1
            while i < len(s) and depth:
                if s[i] in "{[":
                    depth += 1
                elif s[i] in "}]":
                    depth -= 1
                i += 1
        else:
            while i < len(s) and s[i] not in ",}":
                i += 1
        out[key] = _parse_value(s[start:i].strip())
    return out


def _parse_key(key_part: str) -> str:
    """Strip optional quotes from key."""
    k = key_part.strip()
    if (len(k) >= 2 and (k.startswith('"') and k.endswith('"')) or
            (k.startswith("'") and k.endswith("'"))):
        return _parse_value(k)
    return k


# Table header: [section] or [section.sub]
_TABLE_RE = re.compile(r"^\[([^\]]+)\]$")
# Array of tables: [[section]]
_ARRAY_TABLE_RE = re.compile(r"^\[\[([^\]]+)\]\]$")


def load_toml(
    path_or_file: Union[str, Path, TextIO, BinaryIO],
    *,
    verbose_error: bool = False,
) -> dict | None:
    """
    Load TOML from path or file. Stdlib only, no tomli/tomllib.
    Returns dict or None on missing file / parse error.
    Line-oriented for speed; supports [table], [[array of tables]], key = value.
    """
    try:
        if hasattr(path_or_file, "read"):
            if hasattr(path_or_file, "encoding") and path_or_file.encoding:
                text = path_or_file.read()
            else:
                text = path_or_file.read().decode("utf-8")
        else:
            p = Path(path_or_file)
            if not p.exists():
                return None
            text = p.read_text(encoding="utf-8")
    except Exception:
        return None

    root = {}
    current_path: list[str] = []
    current_table = root

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        # [[array of tables]]
        am = _ARRAY_TABLE_RE.match(line)
        if am:
            path = [x.strip().strip('"').strip("'") for x in am.group(1).split(".")]
            lst = _ensure_list_at(root, path)
            new_table = {}
            lst.append(new_table)
            current_path = path
            current_table = new_table
            continue

        # [table]
        tm = _TABLE_RE.match(line)
        if tm:
            path = [x.strip().strip('"').strip("'") for x in tm.group(1).split(".")]
            current_path = path
            current_table = _get_table(root, path)
            continue

        # key = value (or key.path = value; quoted key is single key)
        eq = line.find("=")
        if eq == -1:
            continue
        key_part = line[:eq].strip()
        val_part = line[eq + 1:].strip()
        if not key_part:
            continue

        # Quoted key (e.g. "google.protobuf") is one key; unquoted a.b is dotted
        if key_part.startswith('"') or key_part.startswith("'"):
            key = _parse_value(key_part)
            current_table[key] = _parse_value(val_part)
            continue

        keys = [x.strip().strip('"').strip("'") for x in key_part.split(".")]
        if len(keys) == 1:
            key = _parse_key(keys[0])
            current_table[key] = _parse_value(val_part)
        else:
            # Dotted key: create nested dicts, set last key (redefine as table if was value)
            d = current_table
            for k in keys[:-1]:
                k = _parse_key(k)
                if k not in d or not isinstance(d.get(k), dict):
                    d[k] = {}
                d = d[k]
            d[_parse_key(keys[-1])] = _parse_value(val_part)

    return root


# -----------------------------------------------------------------------------
# Writer: minimal writer for dict/list (SBOM, lockfile, configs)
# -----------------------------------------------------------------------------

def _escape_string(s: str) -> str:
    if not isinstance(s, str):
        return str(s)
    s = s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\t", "\\t")
    return f'"{s}"'


def _escape_key(key: str) -> str:
    key_str = str(key)
    if not key_str.replace("_", "").replace("-", "").replace(".", "").isalnum():
        return _escape_string(key_str)
    return key_str


def _format_value(value: Any, indent: int = 0) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, str):
        return _escape_string(value)
    if isinstance(value, list):
        if not value:
            return "[]"
        if all(not isinstance(item, (dict, list)) for item in value):
            return "[" + ", ".join(_format_value(item, indent) for item in value) + "]"
        lines = ["["]
        for item in value:
            f = _format_value(item, indent + 1)
            if isinstance(item, dict):
                lines.append("  " * (indent + 1) + "{" + f + "},")
            else:
                lines.append("  " * (indent + 1) + f + ",")
        lines.append("  " * indent + "]")
        return "\n".join(lines)
    if isinstance(value, dict):
        inner = ", ".join(f"{_escape_key(k)} = {_format_value(v, indent)}" for k, v in value.items())
        return "{" + inner + "}"
    return str(value)


def _format_dict(data: dict, prefix: str = "", indent: int = 0) -> list[str]:
    lines = []
    primitives = {}
    nested = {}
    for key, val in data.items():
        if isinstance(val, dict):
            nested[key] = val
        else:
            primitives[key] = val
    for key, val in primitives.items():
        lines.append("  " * indent + f"{_escape_key(key)} = {_format_value(val, indent)}")
    for key, val in nested.items():
        table_path = f"{prefix}.{_escape_key(key)}" if prefix else _escape_key(key)
        lines.append("")
        lines.append("  " * indent + f"[{table_path}]")
        lines.extend(_format_dict(val, table_path, indent + 1))
    return lines


def dump_toml(data: Any, path_or_file: Union[str, Path, TextIO]) -> None:
    """
    Write TOML to path or file. Stdlib only.
    Supports dict (as tables), list of dicts (as [[entry]]), primitives.
    """
    def do_write(f: TextIO) -> None:
        if isinstance(data, dict):
            lines = _format_dict(data)
            content = "\n".join(lines)
            f.write(content)
            if content and not content.endswith("\n"):
                f.write("\n")
        elif isinstance(data, list):
            if data and isinstance(data[0], dict):
                for item in data:
                    f.write("[[entry]]\n")
                    item_lines = _format_dict(item, "entry", 0)
                    f.write("\n".join(item_lines))
                    f.write("\n\n")
            else:
                f.write("entries = " + _format_value(data, 0) + "\n")
        else:
            content = _format_value(data, 0)
            f.write(content)
            if not content.endswith("\n"):
                f.write("\n")

    if hasattr(path_or_file, "write"):
        do_write(path_or_file)
        return
    p = Path(path_or_file)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("w", encoding="utf-8") as f:
        do_write(f)
