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

from ..data.data_config import DATA_FILE
from ..ops.json_in_ops import JsonInternalOps
from ..ops.data_operations_abstract import DataOperationsAbstract


def _configure_windows_utf8() -> None:
    """Configure UTF-8 output on Windows consoles."""
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            sys.stderr.reconfigure(encoding="utf-8")
        except AttributeError:
            import codecs

            sys.stdout = codecs.getwriter("utf-8")(sys.stdout.buffer, "strict")
            sys.stderr = codecs.getwriter("utf-8")(sys.stderr.buffer, "strict")


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
        self._xw_engine: Optional[Any] = None
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
            f"  Engine : {JsonInternalOps.ENGINE_NAME}\n"
            "  Dataset: 1GB NDJSON file (records collection)\n"
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
  (anything else)         - Treated as an XWQueryScript query over 'records'

XWQueryScript examples (using 'records' collection - sample only):
  SELECT * FROM records LIMIT 5;
  SELECT id, city FROM records WHERE city = "Riyadh" LIMIT 10;
  SELECT COUNT(*) FROM records;
  
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
  append {"id": "demo-1", "name": "Demo User", "city": "Riyadh"}
  update id demo-1 set city="Jeddah"
  delete id demo-1

Notes:
- IDs and fields must match what actually exists in the dataset.
- For safety, atomic updates are always used under the hood.

You can ALSO run XWQueryScript queries over the 'records' collection (sample), for example:

  SELECT * FROM records LIMIT 5;
  SELECT id, city FROM records WHERE city = "Riyadh" LIMIT 10;
  
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

  SELECT * FROM records                           # Get all records
  SELECT * FROM records LIMIT 10                 # First 10 records
  SELECT id, name, city FROM records LIMIT 5      # Specific fields
  
  SELECT * FROM records WHERE city = "Riyadh"     # Filter by condition
  SELECT * FROM records WHERE age > 30 AND active = true  # Multiple conditions
  SELECT * FROM records WHERE name LIKE "John%"   # Pattern matching
  SELECT * FROM records WHERE age BETWEEN 25 AND 45  # Range query
  SELECT * FROM records WHERE city IN ["Riyadh", "Jeddah"]  # Membership
  
  SELECT * FROM records ORDER BY age DESC LIMIT 10  # Sort descending
  SELECT city, COUNT(*) FROM records GROUP BY city  # Group and count

➕ CREATE / INSERT
--------------------------------------------------------------------------------

  INSERT INTO records VALUES {
    id: "user_001",
    name: "John Doe",
    age: 30,
    city: "Riyadh"
  }

✏️ UPDATE
--------------------------------------------------------------------------------

  UPDATE records SET city = "Jeddah" WHERE id = "user_001"
  UPDATE records SET age = 31, active = true WHERE id = "user_001"
  UPDATE records SET role = "admin" WHERE age > 50

🗑️ DELETE
--------------------------------------------------------------------------------

  DELETE FROM records WHERE id = "user_001"
  DELETE FROM records WHERE age < 18
  DELETE FROM records WHERE active = false

📊 AGGREGATION / STATISTICS
--------------------------------------------------------------------------------

  SELECT COUNT(*) FROM records                    # Count all
  SELECT AVG(age) FROM records                   # Average age
  SELECT MIN(price), MAX(price) FROM records      # Min/Max
  SELECT city, COUNT(*) as count 
    FROM records 
    GROUP BY city 
    ORDER BY count DESC 
    LIMIT 10

🚀 Quick Start Examples
--------------------------------------------------------------------------------

  SELECT * FROM records LIMIT 5                   # See sample data
  SELECT COUNT(*) FROM records                    # Count records
  SELECT DISTINCT city FROM records LIMIT 20      # Unique cities
  
  INSERT INTO records VALUES {id: "test", name: "Test"}
  SELECT * FROM records WHERE id = "test"         # Verify insert
  UPDATE records SET name = "Updated" WHERE id = "test"
  DELETE FROM records WHERE id = "test"

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
            from exonware.xwquery.query.executors.engine import ExecutionEngine
        except ImportError as e:  # noqa: BLE001
            raise RuntimeError(
                "XWQuery library not found or incomplete. "
                "Install with: pip install -e ../../../xwquery\n"
                f"Error: {e}"
            ) from e

        # Build 'records' collection from a SAMPLE of the NDJSON file
        # This allows XWQuery to work without loading the entire 1GB file
        print(f"[INFO] Loading sample of {self._xwquery_sample_size:,} records for XWQuery...")
        records = []
        loaded_count = 0
        
        try:
            with open(self.engine.file_path, "r", encoding="utf-8") as f:
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
            raise RuntimeError(f"Failed to load sample from {self.engine.file_path}: {e}") from e

        if not records:
            raise RuntimeError(
                f"No records loaded from {self.engine.file_path}. "
                "File may be empty or unreadable."
            )

        native = {"records": records}
        self._xw_node = XWNode.from_native(native)
        self._xw_engine = ExecutionEngine()
        self._xwquery_loaded = True
        
        total_records = self.engine.count_records()
        print(
            f"[INFO] XWQuery ready! Loaded {len(records):,} records "
            f"(sample of {total_records:,} total). "
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
            if self._xw_engine is None or self._xw_node is None:
                raise RuntimeError("XWQuery not initialized")

            # Clean up query (remove trailing semicolon if present)
            query = query.strip().rstrip(";").strip()
            if not query:
                print("[ERROR] Empty query")
                return

            start = time.time()
            result = self._xw_engine.execute(query, self._xw_node)
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


def main() -> None:
    """Entry point used by run.py."""
    _configure_windows_utf8()
    engine = JsonInternalOps(file_path=str(DATA_FILE))
    console = JsonConsole(engine)
    console.run()


if __name__ == "__main__":
    main()


