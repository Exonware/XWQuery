#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/ops/json_in_ops.py
"""
JSON operations engine (V1-style, non-indexed) for xwnode_console2.
This engine operates directly on a large NDJSON file using Python's
standard library json module and streaming patterns inspired by the
json_utils V1 design, but implemented locally so that this example
remains self-contained.
"""

from __future__ import annotations
from collections.abc import Iterable
import asyncio
import json
import os
import tempfile
import weakref
from asyncio import Lock
from typing import Any
from .data_ops_interface import (
    JsonPath,
    JsonValue,
    MatchFn,
    UpdateFn,
    SupportsJsonMatch,
)
from .data_operations_abstract import DataOperationsAbstract


class JsonRecordNotFound(Exception):
    """Raised when no JSON record matches the requested criteria."""


class JsonStreamError(Exception):
    """Raised when a streaming JSON operation fails."""
# ----------------------------------------------------------------------
# Global write locks per event loop (for async atomic updates)
# ----------------------------------------------------------------------
_write_locks: "weakref.WeakKeyDictionary[asyncio.AbstractEventLoop, Lock]" = (
    weakref.WeakKeyDictionary()
)


def _get_write_lock() -> Lock:
    """
    Get or create the write lock for the current event loop.
    Mirrors the root-cause fix pattern used in `json_utils` to ensure
    that locks are correctly bound to the active event loop and cleaned
    up when loops are destroyed.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        # No event loop running - fallback lock (edge cases only)
        return Lock()
    if loop not in _write_locks:
        _write_locks[loop] = Lock()
    return _write_locks[loop]
# ----------------------------------------------------------------------
# Low-level streaming helpers (parity with json_utils.py)
# ----------------------------------------------------------------------


def _iter_json_lines(fp: Iterable[str]) -> Iterable[tuple[int, str, JsonValue]]:
    """
    Yield (line_no, raw_line, parsed_json) for each non-empty line.
    Designed for very large NDJSON files.
    """
    for line_no, line in enumerate(fp, start=1):
        stripped = line.strip()
        if not stripped:
            continue
        try:
            obj = json.loads(stripped)
        except json.JSONDecodeError as e:
            raise JsonStreamError(f"Invalid JSON at line {line_no}: {e}") from e
        yield line_no, line, obj


def _get_by_path(obj: JsonValue, path: JsonPath | None) -> JsonValue:
    if path is None:
        return obj
    cur: JsonValue = obj
    for key in path:
        try:
            if isinstance(key, int):
                cur = cur[key]
            else:
                cur = cur[str(key)]
        except (KeyError, IndexError, TypeError) as e:
            raise JsonStreamError(f"Path not found: {path!r}") from e
    return cur


def stream_read(
    file_path: str,
    match: MatchFn,
    path: JsonPath | None = None,
    encoding: str = "utf-8",
) -> JsonValue:
    """
    Stream a huge NDJSON file and return the first record (or sub-path) matching `match`.
    Does NOT load the whole file into memory.
    """
    try:
        with open(file_path, "r", encoding=encoding) as f:
            for _line_no, _raw, obj in _iter_json_lines(f):
                if match(obj):
                    return _get_by_path(obj, path)
    except FileNotFoundError as e:
        raise JsonStreamError(f"File not found: {file_path}") from e
    except PermissionError as e:
        raise JsonStreamError(f"Permission denied: {file_path}") from e
    except OSError as e:
        raise JsonStreamError(f"OS error for {file_path}: {e}") from e
    raise JsonRecordNotFound("No matching JSON record found")
async def async_stream_read(
    file_path: str,
    match: MatchFn,
    path: JsonPath | None = None,
    encoding: str = "utf-8",
) -> JsonValue:
    """
    Async version of stream_read - allows concurrent reads from the same file.
    """
    def _read_sync() -> JsonValue:
        with open(file_path, "r", encoding=encoding) as f:
            for _line_no, _raw, obj in _iter_json_lines(f):
                if match(obj):
                    return _get_by_path(obj, path)
        raise JsonRecordNotFound("No matching JSON record found")
    try:
        return await asyncio.to_thread(_read_sync)
    except FileNotFoundError as e:
        raise JsonStreamError(f"File not found: {file_path}") from e
    except PermissionError as e:
        raise JsonStreamError(f"Permission denied: {file_path}") from e
    except OSError as e:
        raise JsonStreamError(f"OS error for {file_path}: {e}") from e


def stream_update(
    file_path: str,
    match: MatchFn,
    updater: UpdateFn,
    *,
    encoding: str = "utf-8",
    newline: str = "\n",
    atomic: bool = True,
) -> int:
    """
    Stream-copy a huge NDJSON file, applying `updater` to matching records.
    Returns the number of updated records.
    """
    updated_count = 0
    dir_name, base_name = os.path.split(os.path.abspath(file_path))
    temp_fd: int | None = None
    temp_path: str | None = None
    try:
        if atomic:
            temp_fd, temp_path = tempfile.mkstemp(
                prefix=f".{base_name}.tmp.", dir=dir_name, text=True
            )
            out_fp = os.fdopen(temp_fd, "w", encoding=encoding, newline=newline)
        else:
            temp_path = os.path.join(dir_name, f".{base_name}.tmp")
            out_fp = open(temp_path, "w", encoding=encoding, newline=newline)
        with out_fp as out_f, open(file_path, "r", encoding=encoding) as in_f:
            for _line_no, raw_line, obj in _iter_json_lines(in_f):
                try:
                    if match(obj):
                        obj = updater(obj)
                        updated_count += 1
                        raw_line = json.dumps(obj, ensure_ascii=False) + newline
                except Exception as e:  # noqa: BLE001
                    raise JsonStreamError(
                        f"Updater/match failed at line {_line_no}: {e}"
                    ) from e
                out_f.write(raw_line)
        os.replace(temp_path, file_path)
    except FileNotFoundError as e:
        if temp_fd is not None:
            try:
                os.close(temp_fd)
            except Exception:  # noqa: BLE001
                pass
        raise JsonStreamError(f"File not found: {file_path}") from e
    except PermissionError as e:
        raise JsonStreamError(f"Permission denied: {file_path}") from e
    except OSError as e:
        raise JsonStreamError(f"OS error while updating {file_path}: {e}") from e
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:  # noqa: BLE001
                pass
    return updated_count
async def async_stream_update(
    file_path: str,
    match: MatchFn,
    updater: UpdateFn,
    *,
    encoding: str = "utf-8",
    newline: str = "\n",
    atomic: bool = True,
) -> int:
    """
    Async version of stream_update using an event-loop-scoped write lock.
    """
    write_lock = _get_write_lock()
    async with write_lock:
        def _update_sync() -> int:
            return stream_update(
                file_path,
                match,
                updater,
                encoding=encoding,
                newline=newline,
                atomic=atomic,
            )
        return await asyncio.to_thread(_update_sync)


def match_by_id(field: str, value: Any) -> MatchFn:
    """Create a simple matcher: obj[field] == value."""
    def _match(obj: JsonValue) -> bool:
        try:
            return obj.get(field) == value  # type: ignore[union-attr]
        except AttributeError:
            return False
    return _match


def update_path(path: JsonPath, new_value: Any) -> UpdateFn:
    """Create an updater that sets obj[path] = new_value."""
    def _update(obj: JsonValue) -> JsonValue:
        cur = obj
        if not path:
            return new_value
        for key in path[:-1]:
            if isinstance(key, int):
                while len(cur) <= key:
                    cur.append({})
                cur = cur[key]
            else:
                if key not in cur or not isinstance(cur[key], (dict, list)):
                    cur[key] = {}
                cur = cur[key]
        last = path[-1]
        if isinstance(last, int):
            while len(cur) <= last:
                cur.append(None)
            cur[last] = new_value
        else:
            cur[last] = new_value
        return obj
    return _update


class JsonInternalOps(DataOperationsAbstract):
    """Streaming, non-indexed JSON engine using stdlib json."""
    ENGINE_NAME = "json_internal_v1"

    def __init__(self, file_path: str, id_field: str = "id") -> None:
        super().__init__(file_path=file_path, id_field=id_field)
    # ------------------------------------------------------------------
    # Engine metadata / config
    # ------------------------------------------------------------------
    @property

    def name(self) -> str:
        return self.ENGINE_NAME
    @property

    def description(self) -> str:
        return "Streaming JSON engine (V1-style, stdlib json, no index)"
    @property

    def file_path(self) -> str:
        return self._file_path
    @property

    def id_field(self) -> str:
        return self._id_field
    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _iter_json_lines(self) -> Iterable[JsonValue]:
        """Yield parsed JSON objects for each non-empty line for this engine."""
        with open(self._file_path, "r", encoding="utf-8") as f:
            for _line_no, _raw, obj in _iter_json_lines(f):
                yield obj
    @staticmethod

    def _get_by_path(obj: JsonValue, path: JsonPath | None) -> JsonValue:
        return _get_by_path(obj, path)
    # ------------------------------------------------------------------
    # Indexed access (not supported for this engine)
    # ------------------------------------------------------------------

    def ensure_index(self) -> None:
        # Non-indexed engine: no-op
        return None

    async def async_ensure_index(self) -> None:
        return None
    # ------------------------------------------------------------------
    # Point lookups
    # ------------------------------------------------------------------

    def get_by_id(self, id_value: Any) -> JsonValue:
        matcher = self.match_by_id(self._id_field, id_value)
        for obj in self._iter_json_lines():
            if matcher(obj):
                return obj
        raise KeyError(f"Record with {self._id_field}={id_value!r} not found")

    async def async_get_by_id(self, id_value: Any) -> JsonValue:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.get_by_id, id_value)

    def get_by_line(self, line_number: int) -> JsonValue:
        if line_number < 0:
            raise IndexError("line_number must be >= 0")
        for idx, obj in enumerate(self._iter_json_lines()):
            if idx == line_number:
                return obj
        raise IndexError("line_number out of range")

    async def async_get_by_line(self, line_number: int) -> JsonValue:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.get_by_line, line_number)
    # ------------------------------------------------------------------
    # Paging
    # ------------------------------------------------------------------

    def get_page(self, page_number: int, page_size: int) -> list[JsonValue]:
        if page_number < 1:
            raise ValueError("page_number must be >= 1")
        if page_size <= 0:
            raise ValueError("page_size must be > 0")
        start = (page_number - 1) * page_size
        end = start + page_size
        results: list[JsonValue] = []
        for idx, obj in enumerate(self._iter_json_lines()):
            if idx < start:
                continue
            if idx >= end:
                break
            results.append(obj)
        return results

    async def async_get_page(self, page_number: int, page_size: int) -> list[JsonValue]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.get_page, page_number, page_size)
    # ------------------------------------------------------------------
    # Streaming search
    # ------------------------------------------------------------------

    def find_first(self, match: SupportsJsonMatch, path: JsonPath | None = None) -> JsonValue:
        for obj in self._iter_json_lines():
            if match(obj):
                return self._get_by_path(obj, path)
        raise KeyError("No matching record found")

    async def async_find_first(
        self,
        match: SupportsJsonMatch,
        path: JsonPath | None = None,
    ) -> JsonValue:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.find_first, match, path)

    def find_all(
        self,
        match: SupportsJsonMatch,
        limit: int | None = None,
        path: JsonPath | None = None,
    ) -> list[JsonValue]:
        results: list[JsonValue] = []
        for obj in self._iter_json_lines():
            if match(obj):
                results.append(self._get_by_path(obj, path))
                if limit is not None and len(results) >= limit:
                    break
        return results

    async def async_find_all(
        self,
        match: SupportsJsonMatch,
        limit: int | None = None,
        path: JsonPath | None = None,
    ) -> list[JsonValue]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.find_all, match, limit, path)
    # ------------------------------------------------------------------
    # Atomic update operations
    # ------------------------------------------------------------------

    def update_matching(
        self,
        match: SupportsJsonMatch,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        """Delegate to module-level stream_update for parity with json_utils."""
        return stream_update(self._file_path, match, updater, atomic=atomic)

    async def async_update_matching(
        self,
        match: SupportsJsonMatch,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        return await async_stream_update(self._file_path, match, updater, atomic=atomic)

    def update_by_id(
        self,
        id_value: Any,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        matcher = self.match_by_id(self._id_field, id_value)
        return self.update_matching(matcher, updater, atomic=atomic)

    async def async_update_by_id(
        self,
        id_value: Any,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.update_by_id, id_value, updater, atomic)
    # ------------------------------------------------------------------
    # Utility helpers
    # ------------------------------------------------------------------
    @staticmethod

    def match_by_id(field: str, value: Any) -> MatchFn:
        return match_by_id(field, value)
    @staticmethod

    def update_path(path: JsonPath, new_value: Any) -> UpdateFn:
        return update_path(path, new_value)
__all__ = [
    "JsonRecordNotFound",
    "JsonStreamError",
    "stream_read",
    "async_stream_read",
    "stream_update",
    "async_stream_update",
    "match_by_id",
    "update_path",
    "JsonInternalOps",
]
