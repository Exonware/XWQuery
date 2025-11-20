"""
Cost Model

Estimates query execution costs.

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Version:** 0.0.1.5
"""

from typing import Optional
import math

from .base import ACostModel
from .contracts import IStatisticsManager
from .defs import CostFactors, JoinAlgorithm


class SimpleCostModel(ACostModel):
    """
    Simple cost model for query cost estimation
    
    Uses basic formulas based on row counts and operation types.
    More sophisticated models would consider CPU, I/O, memory, and network costs.
    """
    
    def __init__(
        self,
        statistics_manager: Optional[IStatisticsManager] = None,
        page_size: int = 8192  # 8KB default page size
    ):
        super().__init__(statistics_manager)
        self._page_size = page_size
    
    async def estimate_scan_cost(
        self,
        table: str,
        scan_type: str,
        selectivity: float = 1.0
    ) -> float:
        """
        Estimate the cost of scanning a table
        
        Cost = I/O cost + CPU cost
        """
        # Get table size
        if self._statistics_manager:
            try:
                row_count = await self._statistics_manager.get_table_row_count(table)
            except:
                row_count = 1000  # Default estimate
        else:
            row_count = 1000
        
        # Assume average row size of 100 bytes
        avg_row_size = 100
        total_size = row_count * avg_row_size
        num_pages = math.ceil(total_size / self._page_size)
        
        if scan_type == 'sequential':
            # Sequential scan reads all pages
            io_cost = num_pages * CostFactors.SEQUENTIAL_PAGE_COST
            cpu_cost = row_count * CostFactors.CPU_TUPLE_COST
        elif scan_type == 'index':
            # Index scan is more selective
            io_cost = (num_pages * selectivity) * CostFactors.RANDOM_PAGE_COST
            cpu_cost = (row_count * selectivity) * CostFactors.CPU_INDEX_TUPLE_COST
        else:
            # Default to sequential
            io_cost = num_pages * CostFactors.SEQUENTIAL_PAGE_COST
            cpu_cost = row_count * CostFactors.CPU_TUPLE_COST
        
        return io_cost + cpu_cost
    
    async def estimate_join_cost(
        self,
        left_rows: int,
        right_rows: int,
        join_type: str,
        selectivity: float = 1.0
    ) -> float:
        """
        Estimate the cost of a join operation
        
        Different algorithms have different costs:
        - Nested Loop: O(M * N)
        - Hash Join: O(M + N)
        - Merge Join: O(M log M + N log N)
        """
        if join_type == 'nested_loop':
            # Nested loop join: compare every left row with every right row
            cpu_cost = left_rows * right_rows * CostFactors.CPU_OPERATOR_COST
            io_cost = 0  # Assuming data is already in memory
            
        elif join_type == 'hash':
            # Hash join: build hash table + probe
            # Build phase: hash all left rows
            build_cost = left_rows * CostFactors.CPU_OPERATOR_COST
            # Probe phase: probe with all right rows
            probe_cost = right_rows * CostFactors.CPU_OPERATOR_COST
            # Memory cost for hash table
            memory_cost = left_rows * CostFactors.HASH_MEM_COST
            
            cpu_cost = build_cost + probe_cost
            io_cost = memory_cost
            
        elif join_type == 'merge':
            # Merge join: sort both sides + merge
            left_sort_cost = left_rows * math.log2(max(left_rows, 2)) * CostFactors.CPU_OPERATOR_COST
            right_sort_cost = right_rows * math.log2(max(right_rows, 2)) * CostFactors.CPU_OPERATOR_COST
            merge_cost = (left_rows + right_rows) * CostFactors.CPU_OPERATOR_COST
            
            cpu_cost = left_sort_cost + right_sort_cost + merge_cost
            io_cost = (left_rows + right_rows) * CostFactors.SORT_MEM_COST
            
        else:
            # Default to hash join cost
            cpu_cost = (left_rows + right_rows) * CostFactors.CPU_OPERATOR_COST
            io_cost = left_rows * CostFactors.HASH_MEM_COST
        
        # Apply selectivity to output size cost
        output_rows = left_rows * right_rows * selectivity
        output_cost = output_rows * CostFactors.CPU_TUPLE_COST
        
        return cpu_cost + io_cost + output_cost
    
    async def estimate_sort_cost(self, rows: int, columns: int) -> float:
        """
        Estimate the cost of sorting
        
        Cost = O(N log N) comparisons + memory/disk I/O
        """
        if rows == 0:
            return 0.0
        
        # Comparison cost: O(N log N)
        comparison_cost = rows * math.log2(max(rows, 2)) * CostFactors.CPU_OPERATOR_COST
        
        # Memory cost for sort buffer
        memory_cost = rows * columns * CostFactors.SORT_MEM_COST
        
        # If data doesn't fit in memory, external sort is needed
        # Assume memory can hold 10000 rows
        if rows > 10000:
            # External sort: additional I/O for merge passes
            num_passes = math.ceil(math.log2(rows / 10000))
            io_cost = rows * num_passes * CostFactors.SEQUENTIAL_PAGE_COST
        else:
            io_cost = 0
        
        return comparison_cost + memory_cost + io_cost
    
    async def estimate_aggregate_cost(
        self,
        rows: int,
        group_by_columns: int,
        aggregate_functions: int
    ) -> float:
        """
        Estimate the cost of aggregation
        
        Cost depends on whether grouping is needed and number of groups
        """
        # Hash table for grouping
        if group_by_columns > 0:
            hash_cost = rows * CostFactors.CPU_OPERATOR_COST
            memory_cost = rows * CostFactors.HASH_MEM_COST
        else:
            # Simple aggregation without grouping
            hash_cost = 0
            memory_cost = 0
        
        # Cost of aggregate functions
        aggregate_cost = rows * aggregate_functions * CostFactors.CPU_OPERATOR_COST
        
        return hash_cost + memory_cost + aggregate_cost
    
    async def estimate_filter_cost(self, rows: int, selectivity: float) -> float:
        """
        Estimate the cost of filtering
        
        Simple CPU cost for evaluating predicates
        """
        return rows * CostFactors.CPU_OPERATOR_COST
    
    def choose_join_algorithm(
        self,
        left_rows: int,
        right_rows: int,
        has_index: bool = False
    ) -> str:
        """
        Choose the best join algorithm based on input sizes
        
        Returns:
            str: 'nested_loop', 'hash', or 'merge'
        """
        # Simple heuristics
        if has_index and left_rows < 1000:
            return 'nested_loop'  # Index nested loop for small outer table
        elif left_rows < 10 or right_rows < 10:
            return 'nested_loop'  # Nested loop for very small tables
        elif left_rows > 10000 and right_rows > 10000:
            return 'merge'  # Merge join for large sorted tables
        else:
            return 'hash'  # Hash join is default for medium-sized tables

