#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/ops/data_ops_interface.py

"""
Abstract interface for JSON data operations used by xwnode_console2.

This interface is intentionally 100% abstract (no concrete logic)
and acts as the contract between:
  - The interactive console layer, and
  - Concrete JSON operation engines (V1–V4 style, indexed/non-indexed)

Engines may use different underlying implementations, such as:
  - json_utils / json_utils_indexed       (V1 / V2)
  - json_libs / json_libs_indexed         (V3)
  - json_libs_v4 / json_libs_indexed_v4   (V4)

but they must all conform to this interface so that the console can
switch engines at runtime without changing its behaviour.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Callable, Dict, Iterable, List, Optional, Protocol, Union

JsonValue = Any
JsonPath = Union[List[Union[str, int]], tuple]
MatchFn = Callable[[JsonValue], bool]
UpdateFn = Callable[[JsonValue], JsonValue]


class SupportsJsonMatch(Protocol):
    """Protocol for match functions used in advanced search operations."""

    def __call__(self, record: JsonValue) -> bool:  # pragma: no cover - structural
        ...


class DataOpsInterface(ABC):
    """
    Unified abstract interface for JSON data operations over large NDJSON files.

    The design focuses on:
    - Atomic, safe updates to very large files (1GB+)
    - Efficient indexed access when available
    - A small, console-friendly API surface
    """

    # ------------------------------------------------------------------
    # Engine metadata
    # ------------------------------------------------------------------

    @property
    @abstractmethod
    def name(self) -> str:
        """Short engine name used for selection in the console (e.g. 'json_in_v1')."""
        raise NotImplementedError

    @property
    @abstractmethod
    def description(self) -> str:
        """Human-friendly description of the engine's strategy and characteristics."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Core configuration
    # ------------------------------------------------------------------

    @property
    @abstractmethod
    def file_path(self) -> str:
        """Absolute path to the NDJSON file operated on by this engine."""
        raise NotImplementedError

    @property
    @abstractmethod
    def id_field(self) -> str:
        """Logical ID field name (default: 'id')."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Indexed access (optional but recommended)
    # ------------------------------------------------------------------

    @abstractmethod
    def ensure_index(self) -> None:
        """
        Ensure that an index exists and is valid for the current file.

        Implementations MAY be a no-op if indexing is not supported.
        """
        raise NotImplementedError

    @abstractmethod
    async def async_ensure_index(self) -> None:
        """Async variant of ensure_index()."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Point lookups
    # ------------------------------------------------------------------

    @abstractmethod
    def get_by_id(self, id_value: Any) -> JsonValue:
        """
        Fetch a single record by logical ID.

        Implementations MAY use indexing, streaming, or a hybrid approach.
        Must raise a well-defined exception when record is not found.
        """
        raise NotImplementedError

    @abstractmethod
    async def async_get_by_id(self, id_value: Any) -> JsonValue:
        """Async variant of get_by_id()."""
        raise NotImplementedError

    @abstractmethod
    def get_by_line(self, line_number: int) -> JsonValue:
        """
        Fetch a single record by 0-based line number.

        For engines without an index, this may be implemented via
        streaming scan up to the requested line.
        """
        raise NotImplementedError

    @abstractmethod
    async def async_get_by_line(self, line_number: int) -> JsonValue:
        """Async variant of get_by_line()."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Paging
    # ------------------------------------------------------------------

    @abstractmethod
    def get_page(self, page_number: int, page_size: int) -> List[JsonValue]:
        """
        Return a page of records using the most efficient strategy.

        page_number: 1-based
        page_size  : number of records per page
        """
        raise NotImplementedError

    @abstractmethod
    async def async_get_page(self, page_number: int, page_size: int) -> List[JsonValue]:
        """Async variant of get_page()."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Streaming search
    # ------------------------------------------------------------------

    @abstractmethod
    def find_first(self, match: SupportsJsonMatch, path: Optional[JsonPath] = None) -> JsonValue:
        """
        Stream the file and return the first record (or sub-path) matching the predicate.

        Implementations MUST avoid loading the whole file into memory.
        """
        raise NotImplementedError

    @abstractmethod
    async def async_find_first(
        self,
        match: SupportsJsonMatch,
        path: Optional[JsonPath] = None,
    ) -> JsonValue:
        """Async variant of find_first()."""
        raise NotImplementedError

    @abstractmethod
    def find_all(
        self,
        match: SupportsJsonMatch,
        limit: Optional[int] = None,
        path: Optional[JsonPath] = None,
    ) -> List[JsonValue]:
        """
        Stream the file and return all matching records (or sub-paths), up to `limit`.

        Implementations MUST be careful with memory usage for very large result sets.
        """
        raise NotImplementedError

    @abstractmethod
    async def async_find_all(
        self,
        match: SupportsJsonMatch,
        limit: Optional[int] = None,
        path: Optional[JsonPath] = None,
    ) -> List[JsonValue]:
        """Async variant of find_all()."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Atomic update operations
    # ------------------------------------------------------------------

    @abstractmethod
    def update_matching(
        self,
        match: SupportsJsonMatch,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        """
        Atomically update all records that match the predicate.

        MUST:
        - Use a safe, atomic write strategy when atomic=True
        - Return the count of updated records
        """
        raise NotImplementedError

    @abstractmethod
    async def async_update_matching(
        self,
        match: SupportsJsonMatch,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        """Async variant of update_matching()."""
        raise NotImplementedError

    @abstractmethod
    def update_by_id(
        self,
        id_value: Any,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        """
        Convenience helper: update a single record by logical ID.

        Engines MAY implement this via indexed lookup + targeted update
        or by delegating to update_matching() with a match_by_id() helper.
        """
        raise NotImplementedError

    @abstractmethod
    async def async_update_by_id(
        self,
        id_value: Any,
        updater: UpdateFn,
        *,
        atomic: bool = True,
    ) -> int:
        """Async variant of update_by_id()."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Utility helpers
    # ------------------------------------------------------------------

    @staticmethod
    @abstractmethod
    def match_by_id(field: str, value: Any) -> MatchFn:
        """Create a simple matcher: record[field] == value."""
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def update_path(path: JsonPath, new_value: Any) -> UpdateFn:
        """Create an updater that sets record[path] = new_value."""
        raise NotImplementedError


# Alias to match requested naming convention in the plan
data_ops_interface = DataOpsInterface

__all__ = [
    "JsonValue",
    "JsonPath",
    "MatchFn",
    "UpdateFn",
    "SupportsJsonMatch",
    "DataOpsInterface",
    "data_ops_interface",
]


