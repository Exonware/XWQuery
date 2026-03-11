#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/console/console.py
"""
JsonInternalOps Interactive Console
This console provides a simple REPL for exploring and mutating the
1GB NDJSON dataset via the JsonInternalOps engine. It focuses on the
core operations implemented by DataOperationsAbstract:
- CREATE: append_record, insert_record_at_position, bulk_append
- READ  : get_by_id, get_by_line, get_page, get_all_matching, count_records
- UPDATE: update_by_id, update_matching
- DELETE: delete_record_by_id, delete_record_by_line
"""

from __future__ import annotations
import json
import sys
import time
from typing import Any, Optional
# ⚠️ CRITICAL: Use xwsystem utility for UTF-8 configuration
# MANDATORY per GUIDE_DEV.md line 54 - Never manually implement functionality that exists in xwsystem
from exonware.xwsystem.console.cli import ensure_utf8_console
from ..data.data_config import DATA_FILE, XWJSON_DATA_FILE
from ..ops.json_in_ops import JsonInternalOps
from ..ops.data_operations_abstract import DataOperationsAbstract


class JsonConsole:
    """Minimal interactive console around a DataOperationsAbstract engine."""

    def __init__(self, engine: DataOperationsAbstract, xwquery_sample_size: int = 10000) -> None:
        """
        Initialize console with engine and optional XWQuery sample size.
        Args:
            engine: The data operations engine to use
            xwquery_sample_size: Number of records to load into XWNode for XWQuery
                                (default: 10000). Set to 0 to disable XWQuery.
        """
        self.engine = engine
        self._xwquery_sample_size = xwquery_sample_size
        self._xw_node: Optional[Any] = None
        self._xw_data: Optional[dict[str, Any]] = None
        self._xwquery_loaded = False
    # ------------------------------------------------------------------ #
    # UI helpers
    # ------------------------------------------------------------------ #
    @staticmethod

    def print_banner() -> None:
        print(
            "\n"
            "================================================================\n"
            "      JsonInternalOps + XWQuery Console (xwnode_console2)\n"
            "================================================================\n"
            f"  Engine : {JsonInternalOps.ENGINE_NAME} (with Serialization Engine)\n"
            "  Dataset: 1GB NDJSON file (records collection)\n"
            "  Formats: JSON, BSON, NDJSON, XWJSON (via ISerialization)\n"
            "================================================================\n"
        )
    @staticmethod

    def print_help() -> None:
        print(
            """
Commands:
  help                    - Show this help
  info                    - Show engine and dataset info
  count                   - Count total records
  get id <ID>             - Get record by logical id
  get line <N>            - Get record by 0-based line number
  page <page> <size>      - Show a page of records
  find field=value        - Find first record where field == value
  find-all field=value    - Find ALL records where field == value (limit 20)
  append {"json": ...}    - Append a new record (JSON object)
  update id <ID> set field=value
                          - Update a single field on record with given id
  delete id <ID>          - Delete first record with given id
  delete line <N>         - Delete record at line number N (0-based)
  examples                - Show example operations
  xwquery-help            - Show XWQueryScript command reference
  load <file>             - Load data from file (JSON/BSON/NDJSON/XWJSON) using serialization engine
  convert-to-xwjson       - Convert NDJSON data to XWJSON format
  (anything else)         - Treated as an XWQueryScript query over 'records'
XWQueryScript examples (using 'records' collection - sample only):
  select * from records limit 5;
  select id, location from records where location = "Nashville" limit 10;
  select count(*) from records;
Note: XWQuery operates on a sample (default: 10,000 records) for performance.
      Use low-level operations (get, find, page) to query the full dataset.
  quit / exit             - Exit console
"""
        )

    def print_examples(self) -> None:
        print(
            """
Example operations you can try:
  # Discover a real record and its fields
  count
  get line 0
  # Then use an actual id and field values from that record:
  get id <existing-id>
  page 1 5
  find id=<existing-id>
  find-all city="<existing-city>"
  # Mutating operations (be careful, they change the file on disk):
  append {"id": "demo-1", "display_name": "Demo User", "location": "Nashville"}
  update id demo-1 set location="Phoenix"
  delete id demo-1
Notes:
- IDs and fields must match what actually exists in the dataset.
- For safety, atomic updates are always used under the hood.
You can ALSO run XWQueryScript queries over the 'records' collection (sample), for example:
  select * from records limit 5;
  select id, city from records where city = "Riyadh" limit 10;
Note: XWQuery uses a sample of records for performance. Use low-level operations
      (get, find, page) to query the full 1GB dataset.
Type 'xwquery-help' for a complete XWQueryScript command reference!
"""
        )

    def print_xwquery_help(self) -> None:
        """Print XWQueryScript command reference."""
        print(
            """
================================================================================
                    XWQueryScript Commands Reference
================================================================================
Collection Name: 'records' (sample of ~10,000 records)
📖 READ / LIST / SEARCH
--------------------------------------------------------------------------------
  select * from records                           # Get all records
  select * from records limit 10                 # First 10 records
  select id, display_name, location from records limit 5      # Specific fields
  select * from records where location = "Nashville"     # Filter by condition
  select * from records where follower_count > 30 and is_active = true  # Multiple conditions
  select * from records where display_name like "John%"   # Pattern matching
  select * from records where follower_count between 25 and 45  # Range query
  select * from records where location in ["Nashville", "Phoenix"]  # Membership
  select * from records order by follower_count desc limit 10  # Sort descending
  select location, count(*) from records group by location  # Group and count
➕ CREATE / INSERT
--------------------------------------------------------------------------------
  insert into records values {
    id: "user_001",
    display_name: "John Doe",
    location: "Nashville",
    follower_count: 100
  }
✏️ UPDATE
--------------------------------------------------------------------------------
  update records set location = "Phoenix" where id = "user_001"
  update records set follower_count = 150, is_active = true where id = "user_001"
  update records set is_verified = true where follower_count > 5000
🗑️ DELETE
--------------------------------------------------------------------------------
  delete from records where id = "user_001"
  delete from records where age < 18
  delete from records where active = false
📊 AGGREGATION / STATISTICS
--------------------------------------------------------------------------------
  select count(*) from records                    # Count all
  select avg(follower_count) from records                   # Average followers
  select min(follower_count), max(follower_count) from records      # Min/Max followers
  select location, count(*) as count 
    from records 
    group by location 
    order by count desc 
    limit 10
🚀 Quick Start Examples
--------------------------------------------------------------------------------
  select * from records limit 5                   # See sample data
  select count(*) from records                    # Count records
  select distinct location from records limit 20      # Unique locations
  insert into records values {id: "test", display_name: "Test User"}
  select * from records where id = "test"         # Verify insert
  update records set display_name = "Updated" where id = "test"
  delete from records where id = "test"
⚠️ Important Notes
--------------------------------------------------------------------------------
1. XWQuery operates on a SAMPLE (~10,000 records) for performance
2. INSERT/UPDATE/DELETE modify the in-memory sample only (not the file)
3. Use low-level commands (get, find, page, append, update id, delete id)
   to work with the full 1GB dataset and persist changes to disk
4. Collection name is always 'records'
For complete reference, see: XWQUERY_REFERENCE.md
================================================================================
"""
        )
    # ------------------------------------------------------------------ #
    # Command handlers

    def _parse_id_value(self, raw: str) -> Any:
        """
        Parse an id value from the console.
        Tries JSON first so that numeric ids can be written as:
          get id 1
        which will be interpreted as integer 1 (matching typical schemas).
        Falls back to treating the id as a plain string.
        """
        raw = raw.strip()
        try:
            value = json.loads(raw)
        except json.JSONDecodeError:
            value = raw.strip('"').strip("'")
        return value
    # ------------------------------------------------------------------ #

    def cmd_info(self) -> None:
        print(f"Engine   : {self.engine.name}")
        print(f"File     : {self.engine.file_path}")
        print(f"ID Field : {self.engine.id_field}")
        try:
            total = self.engine.count_records()
        except Exception as e:  # noqa: BLE001
            print(f"Count    : error ({e})")
        else:
            print(f"Count    : {total}")

    def cmd_count(self) -> None:
        try:
            total = self.engine.count_records()
            print(f"Total records: {total}")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] count failed: {e}")

    def cmd_get_id(self, id_value: str) -> None:
        try:
            parsed_id = self._parse_id_value(id_value)
            record = self.engine.get_by_id(parsed_id)
            print(json.dumps(record, ensure_ascii=False, indent=2))
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] get id failed: {e}")

    def cmd_get_line(self, line_str: str) -> None:
        try:
            line_no = int(line_str)
            record = self.engine.get_by_line(line_no)
            print(json.dumps(record, ensure_ascii=False, indent=2))
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] get line failed: {e}")

    def cmd_page(self, page_str: str, size_str: str) -> None:
        try:
            page = int(page_str)
            size = int(size_str)
            rows = self.engine.get_page(page, size)
            print(json.dumps(rows, ensure_ascii=False, indent=2))
            print(f"\nReturned {len(rows)} records (page {page}, size {size})")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] page failed: {e}")

    def _parse_field_value(self, expr: str) -> tuple[str, Any]:
        if "=" not in expr:
            raise ValueError("expected field=value")
        field, raw_val = expr.split("=", 1)
        field = field.strip()
        raw_val = raw_val.strip()
        # Try JSON first, then fall back to string
        try:
            value = json.loads(raw_val)
        except json.JSONDecodeError:
            value = raw_val.strip('"').strip("'")
        return field, value

    def cmd_find_first(self, expr: str) -> None:
        try:
            field, value = self._parse_field_value(expr)
            def match(rec: dict) -> bool:
                return rec.get(field) == value
            record = self.engine.find_first(match)
            print(json.dumps(record, ensure_ascii=False, indent=2))
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] find failed: {e}")

    def cmd_find_all(self, expr: str) -> None:
        try:
            field, value = self._parse_field_value(expr)
            def match(rec: dict) -> bool:
                return rec.get(field) == value
            rows = self.engine.find_all(match, limit=20)
            print(json.dumps(rows, ensure_ascii=False, indent=2))
            print(f"\nReturned {len(rows)} records (limit 20)")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] find-all failed: {e}")

    def cmd_append(self, json_str: str) -> None:
        try:
            record = json.loads(json_str)
            if not isinstance(record, dict):
                raise ValueError("append expects a JSON object")
            self.engine.append_record(record)
            print("[OK] Record appended.")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] append failed: {e}")

    def cmd_update_id(self, id_value: str, rest: str) -> None:
        rest = rest.strip()
        if not rest.lower().startswith("set "):
            print("Usage: update id <ID> set field=value")
            return
        try:
            parsed_id = self._parse_id_value(id_value)
            field, value = self._parse_field_value(rest[4:])
            def updater(rec: dict) -> dict:
                rec[field] = value
                return rec
            updated = self.engine.update_by_id(parsed_id, updater, atomic=True)
            print(f"[OK] Updated {updated} record(s).")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] update id failed: {e}")

    def cmd_delete_id(self, id_value: str) -> None:
        try:
            parsed_id = self._parse_id_value(id_value)
            ok = self.engine.delete_record_by_id(parsed_id)
            if ok:
                print("[OK] Record deleted.")
            else:
                print("[INFO] No record found with that id.")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] delete id failed: {e}")

    def cmd_delete_line(self, line_str: str) -> None:
        try:
            line_no = int(line_str)
            ok = self.engine.delete_record_by_line(line_no)
            if ok:
                print("[OK] Record deleted.")
            else:
                print("[INFO] No record at that line.")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] delete line failed: {e}")
    # ------------------------------------------------------------------ #
    # REPL
    # ------------------------------------------------------------------ #

    def run(self) -> None:
        self.print_banner()
        self.print_help()
        while True:
            try:
                line = input("json2> ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\nExiting console.")
                break
            if not line:
                continue
            cmd, *rest = line.split(maxsplit=1)
            arg = rest[0] if rest else ""
            cmd_lower = cmd.lower()
            if cmd_lower in {"quit", "exit"}:
                print("Goodbye.")
                break
            if cmd_lower == "help":
                self.print_help()
            elif cmd_lower == "info":
                self.cmd_info()
            elif cmd_lower == "count":
                self.cmd_count()
            elif cmd_lower == "get" and arg.startswith("id "):
                self.cmd_get_id(arg[3:].strip())
            elif cmd_lower == "get" and arg.startswith("line "):
                self.cmd_get_line(arg[5:].strip())
            elif cmd_lower == "page":
                parts = arg.split()
                if len(parts) != 2:
                    print("Usage: page <page> <size>")
                else:
                    self.cmd_page(parts[0], parts[1])
            elif cmd_lower == "find-all":
                self.cmd_find_all(arg.strip())
            elif cmd_lower == "find":
                self.cmd_find_first(arg.strip())
            elif cmd_lower == "append":
                self.cmd_append(arg.strip())
            elif cmd_lower == "update" and arg.startswith("id "):
                rest_args = arg[3:]
                id_part, _, tail = rest_args.partition(" ")
                self.cmd_update_id(id_part.strip(), tail.strip())
            elif cmd_lower == "delete" and arg.startswith("id "):
                self.cmd_delete_id(arg[3:].strip())
            elif cmd_lower == "delete" and arg.startswith("line "):
                self.cmd_delete_line(arg[5:].strip())
            elif cmd_lower == "examples":
                self.print_examples()
            elif cmd_lower == "xwquery-help":
                self.print_xwquery_help()
            elif cmd_lower == "load":
                self.cmd_load(arg.strip())
            elif cmd_lower == "convert-to-xwjson":
                self.cmd_convert_to_xwjson()
            else:
                # Fallback: treat the entire line as an XWQueryScript query
                self.cmd_xwquery(line)
    # ------------------------------------------------------------------ #
    # XWQueryScript integration
    # ------------------------------------------------------------------ #

    def _ensure_xwquery_loaded(self) -> None:
        """
        Lazily load XWNode and XWQuery ExecutionEngine.
        Loads a sample of records from the NDJSON file into XWNode for XWQuery execution.
        The sample size is configurable (default: 10,000 records) to avoid loading
        the entire 1GB file into memory.
        """
        if self._xwquery_loaded:
            return
        if self._xwquery_sample_size <= 0:
            raise RuntimeError(
                "XWQuery is disabled (sample_size=0). "
                "Use low-level operations (get, find, page) to query the full dataset."
            )
        try:
            from exonware.xwnode import XWNode
        except ImportError as e:  # noqa: BLE001
            raise RuntimeError(
                "XWNode library not found. Install with: pip install -e ../../../xwnode\n"
                f"Error: {e}"
            ) from e
        try:
            from exonware.xwquery import XWQuery
        except ImportError as e:  # noqa: BLE001
            raise RuntimeError(
                "XWQuery library not found or incomplete. "
                "Install with: pip install -e ../../../xwquery\n"
                f"Error: {e}"
            ) from e
        # Prefer XWJSON if available (2.42x faster file loading), fallback to NDJSON
        # Use xwsystem's ISerialization interface for proper format handling
        from ..data.data_config import XWJSON_DATA_FILE
        from pathlib import Path
        file_path = self.engine.file_path
        format_used = None
        # Check if XWJSON file exists and prefer it
        if XWJSON_DATA_FILE.exists():
            file_path = XWJSON_DATA_FILE
            format_used = "xwjson"
            print(f"[INFO] Using XWJSON format (2.42x faster!) - {XWJSON_DATA_FILE.name}")
        else:
            format_used = "jsonl"  # NDJSON/JSONL format
            print(f"[INFO] Using NDJSON format via xwsystem ISerialization - {file_path.name}")
        # Build 'records' collection from a SAMPLE of the file
        print(f"[INFO] Loading sample of {self._xwquery_sample_size:,} records for XWQuery...")
        records = []
        try:
            # Use xwsystem's serialization interface (ISerialization)
            from exonware.xwsystem.io.serialization import get_serializer
            # Get appropriate serializer for the file format using xwsystem
            # For XWJSON: checks UniversalCodecRegistry (auto-registered when xwjson is imported)
            # For NDJSON: uses JsonLinesSerializer (via format_map: 'jsonl', 'ndjson', 'jsonlines')
            serializer = get_serializer(format_used)
            # Load the file using xwsystem's ISerialization interface
            if format_used == "xwjson":
                # XWJSON loads as a single dict/object (2.42x faster than NDJSON!)
                # Uses XWJSONSerializer from UniversalCodecRegistry (auto-registered)
                data = serializer.load_file(str(file_path))
                if isinstance(data, dict) and "records" in data:
                    records = data["records"][:self._xwquery_sample_size]
                elif isinstance(data, list):
                    records = data[:self._xwquery_sample_size]
                elif data is not None:
                    records = [data]
            else:
                # NDJSON/JSONL - load via xwsystem ISerialization 
                # Uses JsonLinesSerializer with HybridParser: msgspec (reading) + orjson (writing)
                # Fast: msgspec is 1.36x faster than orjson for reading
                # But XWJSON is 2.42x faster than NDJSON for file loading!
                data = serializer.load_file(str(file_path))
                if isinstance(data, list):
                    records = data[:self._xwquery_sample_size]
                elif isinstance(data, dict) and "records" in data:
                    records = data["records"][:self._xwquery_sample_size]
                elif data is not None:
                    records = [data]
        except ImportError:
            # Fallback to raw file I/O if xwsystem not available
            print(f"[WARNING] xwsystem serialization not available, using raw file I/O")
            loaded_count = 0
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line in f:
                        if loaded_count >= self._xwquery_sample_size:
                            break
                        line = line.strip()
                        if not line:
                            continue
                        try:
                            records.append(json.loads(line))
                            loaded_count += 1
                        except json.JSONDecodeError:
                            continue
            except Exception as e:  # noqa: BLE001
                raise RuntimeError(f"Failed to load sample from {file_path}: {e}") from e
        except Exception as e:  # noqa: BLE001
            raise RuntimeError(f"Failed to load sample from {file_path} using {format_used} via xwsystem: {e}") from e
        if not records:
            raise RuntimeError(
                f"No records loaded from {self.engine.file_path}. "
                "File may be empty or unreadable."
            )
        # Store native Python data directly (XWQuery now supports native Python)
        self._xw_data = {"records": records}
        # Optionally also store as XWNode for advanced features
        try:
            self._xw_node = XWNode.from_native({"records": records})
        except Exception:
            # XWNode not available - that's okay, we can use native Python
            self._xw_node = None
        self._xwquery_loaded = True
        total_records = self.engine.count_records()
        print(
            f"[INFO] XWQuery ready! Loaded {len(records):,} records "
            f"(sample of {total_records:,} total) from {format_used} format. "
            "Use low-level operations to query the full dataset."
        )

    def cmd_xwquery(self, query: str) -> None:
        """
        Execute an XWQueryScript query over the 'records' collection.
        Note: XWQuery operates on a sample of records (default: 10,000).
        Use low-level operations (get, find, page) to query the full dataset.
        """
        try:
            self._ensure_xwquery_loaded()
            if not self._xwquery_loaded:
                raise RuntimeError("XWQuery not initialized")
            # Clean up query (remove trailing semicolon if present)
            query = query.strip().rstrip(";").strip()
            if not query:
                print("[ERROR] Empty query")
                return
            # Use XWQuery.execute() API with XWQS + Native Engine + AST Action Tree
            # 
            # Flow:
            # 1. XWQS (XWQueryScript): format='xwquery' uses XWQSStrategy.parse_script()
            #    → Parses SQL-like queries using SQLParamExtractor internally
            # 2. AST Action Tree: Query parsed to QueryAction AST (extends ANode)
            #    → QueryAction tree cached for performance
            # 3. Native Engine: NativeOperationsExecutionEngine selected for dict/list data
            #    → Executes QueryAction AST using operation registry and executors
            #
            # This architecture ensures:
            # - Clean separation: parser (XWQS) → AST (QueryAction) → executor (Native Engine)
            # - No data adapters needed - engines work directly on native Python structures
            # - Maximum reuse of xwsystem and xwsyntax components
            from exonware.xwquery import XWQuery
            from exonware.xwquery.errors import XWQueryParseError
            start = time.time()
            # Performance optimization: SQL grammar has known limitations, so for SQL-like queries
            # use XWQueryScript format directly (which uses SQLParamExtractor internally)
            # This avoids SQL parsing failures and exception handling overhead
            query_upper = query.upper().strip()
            # Detect SQL-like queries and use XWQueryScript format directly
            # XWQueryScript uses SQLParamExtractor which handles SQL syntax correctly (case-insensitive)
            # Support both uppercase and lowercase commands (but examples use lowercase for cool look)
            is_sql_like = (
                query_upper.startswith('SELECT') or
                query_upper.startswith('INSERT') or
                query_upper.startswith('UPDATE') or
                query_upper.startswith('DELETE') or
                query_upper.startswith('CREATE') or
                query_upper.startswith('DROP') or
                'COUNT(*)' in query_upper or
                'COUNT (' in query_upper
            )
            # Use XWQueryScript format for SQL-like queries (faster, avoids SQL parsing failures)
            # This ensures: XWQS → QueryAction AST → NativeOperationsExecutionEngine
            if is_sql_like:
                result = XWQuery.execute(query, self._xw_data, format='xwquery')
            else:
                # For non-SQL queries, try auto-detection
                try:
                    result = XWQuery.execute(query, self._xw_data)
                except XWQueryParseError:
                    # Fallback to XWQueryScript format
                    result = XWQuery.execute(query, self._xw_data, format='xwquery')
            elapsed = time.time() - start
            # Format and display results
            if hasattr(result, "data"):
                data = result.data
            else:
                data = result
            if data is not None:
                if isinstance(data, (list, dict)):
                    print(json.dumps(data, ensure_ascii=False, indent=2))
                else:
                    print(data)
            else:
                print("[INFO] Query executed successfully (no data returned)")
            print(f"\n⏱️  Execution time: {elapsed:.3f}s")
            if hasattr(result, "success"):
                status = "✅ Success" if result.success else "❌ Failed"
                print(f"Status: {status}")
                if hasattr(result, "error") and result.error:
                    print(f"Error: {result.error}")
        except RuntimeError as e:
            # Re-raise RuntimeErrors (like missing libraries) as-is
            print(f"[ERROR] {e}")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] XWQueryScript execution failed: {e}")
            import traceback
            traceback.print_exc()

    def cmd_load(self, file_path: str) -> None:
        """
        Load data from a file using the serialization engine (JSON/BSON/NDJSON/XWJSON).
        Demonstrates SerializationOperationsExecutionEngine automatically detecting
        format and using appropriate ISerialization implementation.
        Args:
            file_path: Path to file to load
        """
        if not file_path:
            print("[ERROR] Usage: load <file_path>")
            print("Example: load data.xwjson")
            return
        try:
            from exonware.xwquery import XWQuery
            print(f"[INFO] Loading file using serialization engine: {file_path}")
            print(f"[INFO] Format will be auto-detected from file extension...")
            # Use XWQuery.execute() with file path - serialization engine will be used automatically
            result = XWQuery.execute(f"load from '{file_path}'", None)
            if result.success:
                print(f"[OK] File loaded successfully!")
                print(f"Format: {result.metadata.get('format', 'unknown')}")
                print(f"Serializer: {result.metadata.get('serializer', 'unknown')}")
                # Display a sample of the loaded data
                data = result.data
                if isinstance(data, dict):
                    print(f"Top-level keys: {list(data.keys())[:10]}")
                    # Show first record if it's a collection
                    for key, value in list(data.items())[:1]:
                        if isinstance(value, list) and value:
                            print(f"\nFirst record from '{key}':")
                            print(json.dumps(value[0], ensure_ascii=False, indent=2))
                elif isinstance(data, list):
                    print(f"Records loaded: {len(data)}")
                    if data:
                        print("\nFirst record:")
                        print(json.dumps(data[0], ensure_ascii=False, indent=2))
                else:
                    print(f"Data type: {type(data).__name__}")
            else:
                print(f"[ERROR] Load failed: {result.error}")
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] Load operation failed: {e}")
            import traceback
            traceback.print_exc()

    def cmd_convert_to_xwjson(self) -> None:
        """
        Convert the current NDJSON data to XWJSON format.
        Demonstrates using STORE operation with XWJSON format via serialization engine.
        """
        try:
            from exonware.xwquery import XWQuery
            from pathlib import Path
            print(f"[INFO] Converting NDJSON to XWJSON format...")
            print(f"[INFO] Source: {self.engine.file_path}")
            print(f"[INFO] Target: {XWJSON_DATA_FILE}")
            # Load sample data first
            if not self._xwquery_loaded:
                self._ensure_xwquery_loaded()
            if not self._xw_data:
                print("[ERROR] No data loaded. Cannot convert.")
                return
            # Use STORE operation with XWJSON format
            # Serialization engine will automatically use XWJSONSerializer
            target_path = str(XWJSON_DATA_FILE)
            print(f"[INFO] Using serialization engine to store as XWJSON...")
            # First, we need to save the data - let's use a direct approach
            # Store records collection
            xwjson_data = {"records": self._xw_data.get("records", [])}
            # Use XWQuery STORE operation via serialization engine
            query = f"store to '{target_path}' format 'xwjson'"
            # Actually, let's use the serializer directly to demonstrate
            try:
                from exonware.xwjson.formats.binary.xwjson.serializer import XWJSONSerializer
                serializer = XWJSONSerializer()
                serializer.save_file(xwjson_data, target_path)
                print(f"[OK] Data converted and saved to XWJSON format!")
                print(f"[INFO] File: {target_path}")
                print(f"[INFO] Format: XWJSON")
                print(f"[INFO] Records: {len(xwjson_data.get('records', []))}")
                print(f"\n[INFO] You can now use: load {target_path}")
            except ImportError:
                print("[ERROR] XWJSON serializer not available. Install exonware-xwjson")
            except Exception as e:
                print(f"[ERROR] Conversion failed: {e}")
                import traceback
                traceback.print_exc()
        except Exception as e:  # noqa: BLE001
            print(f"[ERROR] Convert operation failed: {e}")
            import traceback
            traceback.print_exc()


def main() -> None:
    """Entry point used by run.py."""
    ensure_utf8_console()
    engine = JsonInternalOps(file_path=str(DATA_FILE))
    console = JsonConsole(engine)
    console.run()
if __name__ == "__main__":
    main()
