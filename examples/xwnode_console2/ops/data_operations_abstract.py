#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/ops/data_operations_abstract.py
"""
High-level data operations abstraction for xwnode_console2.
This module defines an abstract base class that:
- Extends the low-level `DataOpsInterface`
- Implements reusable CREATE/READ/UPDATE/DELETE/BULK helper methods
  similar to those exercised by the x5 `data_operations` test suite
Concrete engines (JsonInternalOps, JsonInternalOpsIndexed, JsonLib1Ops,
JsonLib1OpsIndexed, JsonLib2Ops, JsonLib2OpsIndexed) subclass this
class and provide the underlying primitives (streaming, indexing, etc.).
"""

from __future__ import annotations
import os
import json
from abc import ABC
from typing import Any, Optional
from .data_ops_interface import (
    DataOpsInterface,
    JsonValue,
    JsonPath,
    MatchFn,
    UpdateFn,
    SupportsJsonMatch,
)


class DataOperationsAbstract(DataOpsInterface, ABC):
    """
    Abstract base class that composes all high-level data operations
    used by the data_operations tests (CREATE/READ/UPDATE/DELETE/BULK),
    on top of the lower-level primitives defined in `DataOpsInterface`.
    Engines subclass this and implement the abstract methods from
    `DataOpsInterface`; all helper methods here become immediately
    available to the console (and tests, if desired).
    """

    def __init__(self, file_path: str, id_field: str = "id") -> None:
        self._file_path = os.path.abspath(file_path)
        self._id_field = id_field
    # ------------------------------------------------------------------
    # Core configuration (concrete)
    # ------------------------------------------------------------------
    @property

    def file_path(self) -> str:
        return self._file_path
    @property

    def id_field(self) -> str:
        return self._id_field
    # ------------------------------------------------------------------
    # High-level CREATE helpers (V1-style)
    # ------------------------------------------------------------------

    def append_record(self, record: dict[str, Any]) -> None:
        """
        Append a record to the end of the file.
        V1-style behaviour mirroring `append_record_v1` in test_helpers,
        implemented once here for all engines.
        """
        records: list[dict[str, Any]] = []
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        records.append(json.loads(line.strip()))
        except FileNotFoundError:
            records = []
        records.append(record)
        dir_name, base_name = os.path.split(self.file_path)
        temp_fd, temp_path = None, None
        import tempfile
        import os as _os
        try:
            temp_fd, temp_path = tempfile.mkstemp(
                prefix=f".{base_name}.tmp.", dir=dir_name, text=True
            )
            with _os.fdopen(temp_fd, "w", encoding="utf-8") as f:
                for rec in records:
                    f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            _os.replace(temp_path, self.file_path)
        except Exception:  # noqa: BLE001
            if temp_path and _os.path.exists(temp_path):
                _os.remove(temp_path)
            raise

    def insert_record_at_position(self, record: dict[str, Any], position: int) -> None:
        """
        Insert record at a specific position (0-based).
        Mirrors `insert_record_at_position_v1` logic.
        """
        records: list[dict[str, Any]] = []
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        records.append(json.loads(line.strip()))
        except FileNotFoundError:
            records = []
        records.insert(position, record)
        dir_name, base_name = os.path.split(self.file_path)
        temp_fd, temp_path = None, None
        import tempfile
        import os as _os
        try:
            temp_fd, temp_path = tempfile.mkstemp(
                prefix=f".{base_name}.tmp.", dir=dir_name, text=True
            )
            with _os.fdopen(temp_fd, "w", encoding="utf-8") as f:
                for rec in records:
                    f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            _os.replace(temp_path, self.file_path)
        except Exception:  # noqa: BLE001
            if temp_path and _os.path.exists(temp_path):
                _os.remove(temp_path)
            raise

    def bulk_append(self, records: list[dict[str, Any]]) -> int:
        """Append multiple records; returns count appended."""
        for rec in records:
            self.append_record(rec)
        return len(records)
    # ------------------------------------------------------------------
    # High-level DELETE helpers (V1-style)
    # ------------------------------------------------------------------

    def delete_record_by_id(self, record_id: Any) -> bool:
        """
        Delete the FIRST record whose id_field == record_id.
        Mirrors `delete_record_by_id_v1` semantics.
        """
        records: list[dict[str, Any]] = []
        found = False
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        obj = json.loads(line.strip())
                        if obj.get(self.id_field) == record_id and not found:
                            found = True
                        else:
                            records.append(obj)
        except FileNotFoundError:
            return False
        if not found:
            return False
        dir_name, base_name = os.path.split(self.file_path)
        temp_fd, temp_path = None, None
        import tempfile
        import os as _os
        try:
            temp_fd, temp_path = tempfile.mkstemp(
                prefix=f".{base_name}.tmp.", dir=dir_name, text=True
            )
            with _os.fdopen(temp_fd, "w", encoding="utf-8") as f:
                for rec in records:
                    f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            _os.replace(temp_path, self.file_path)
            return True
        except Exception:  # noqa: BLE001
            if temp_path and _os.path.exists(temp_path):
                _os.remove(temp_path)
            raise

    def delete_record_by_line(self, line_number: int) -> bool:
        """
        Delete record by line number (0-based), with validation.
        Mirrors `delete_record_by_line_v1` semantics.
        """
        if line_number < 0:
            return False
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                total_lines = sum(1 for line in f if line.strip())
        except FileNotFoundError:
            return False
        if line_number >= total_lines:
            return False
        records: list[dict[str, Any]] = []
        found = False
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                for i, line in enumerate(f):
                    if line.strip():
                        if i == line_number:
                            found = True
                        else:
                            records.append(json.loads(line.strip()))
        except (FileNotFoundError, IndexError, json.JSONDecodeError):
            return False
        if not found:
            return False
        dir_name, base_name = os.path.split(self.file_path)
        temp_fd, temp_path = None, None
        import tempfile
        import os as _os
        try:
            temp_fd, temp_path = tempfile.mkstemp(
                prefix=f".{base_name}.tmp.", dir=dir_name, text=True
            )
            with _os.fdopen(temp_fd, "w", encoding="utf-8") as f:
                for rec in records:
                    f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            _os.replace(temp_path, self.file_path)
            return True
        except Exception:  # noqa: BLE001
            if temp_path and _os.path.exists(temp_path):
                _os.remove(temp_path)
            raise
    # ------------------------------------------------------------------
    # High-level READ helpers
    # ------------------------------------------------------------------

    def get_all_matching(self, match: MatchFn) -> list[dict[str, Any]]:
        """
        Get all records matching criteria.
        Mirrors `get_all_matching_v1` semantics (non-indexed).
        """
        results: list[dict[str, Any]] = []
        if not self.file_path or not os.path.exists(self.file_path):
            return results
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if not line.strip():
                        continue
                    try:
                        obj = json.loads(line.strip())
                        if match(obj):
                            results.append(obj)
                    except (json.JSONDecodeError, UnicodeDecodeError) as e:
                        import warnings
                        warnings.warn(
                            f"Skipping malformed line in {self.file_path}: {e}",
                            UserWarning,
                        )
                        continue
        except FileNotFoundError:
            pass
        except (OSError, PermissionError) as e:  # noqa: PERF203
            raise RuntimeError(f"Failed to read file {self.file_path}: {e}") from e
        return results

    def count_records(self) -> int:
        """
        Count total records in file (non-indexed).
        Mirrors `count_records_v1`.
        """
        if not self.file_path or not os.path.exists(self.file_path):
            return 0
        try:
            if os.path.getsize(self.file_path) == 0:
                return 0
        except (OSError, PermissionError):
            pass
        count = 0
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        count += 1
        except FileNotFoundError:
            return 0
        except (OSError, PermissionError) as e:  # noqa: PERF203
            raise RuntimeError(f"Failed to read file {self.file_path}: {e}") from e
        return count
__all__ = ["DataOperationsAbstract"]
