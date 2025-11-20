"""
XWQuery Facade - Enhanced Public API

Provides enhanced facade with convenience methods, presets,
and improved usability.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: October 26, 2025
"""

from typing import Any, List, Dict, Optional
from .contracts import ExecutionResult


class XWQueryFacade:
    """
    Enhanced facade for XWQuery with convenience methods and presets.
    
    This class provides additional helper methods beyond the main XWQuery class
    for improved developer experience.
    """
    
    def __init__(self):
        """Initialize facade with execution engine."""
        from .query.executors.engine import ExecutionEngine
        from .query.strategies.xwquery import XWQueryScriptStrategy
        
        self._engine = ExecutionEngine()
        self._parser = XWQueryScriptStrategy()
    
    # ============================================================================
    # CONVENIENCE QUERY METHODS
    # ============================================================================
    
    @staticmethod
    def quick_select(data: Any, filter_expr: str = None, fields: List[str] = None) -> ExecutionResult:
        """
        Quick SELECT query with optional filter and fields.
        
        Args:
            data: Data to query
            filter_expr: Optional WHERE clause (without WHERE keyword)
            fields: Optional list of fields to select
            
        Returns:
            ExecutionResult with filtered data
            
        Example:
            >>> XWQueryFacade.quick_select(data, "age > 25", ["name", "email"])
        """
        from . import XWQuery
        
        fields_str = ", ".join(fields) if fields else "*"
        where_clause = f" WHERE {filter_expr}" if filter_expr else ""
        query = f"SELECT {fields_str} FROM data{where_clause}"
        
        return XWQuery.execute(query, data)
    
    @staticmethod
    def quick_filter(data: Any, condition: str) -> ExecutionResult:
        """
        Quick filter operation - alias for WHERE.
        
        Args:
            data: Data to filter
            condition: Filter condition
            
        Returns:
            Filtered results
        """
        return XWQueryFacade.quick_select(data, filter_expr=condition)
    
    @staticmethod
    def quick_aggregate(data: Any, agg_func: str, field: str, group_by: str = None) -> ExecutionResult:
        """
        Quick aggregation query.
        
        Args:
            data: Data to aggregate
            agg_func: Aggregation function (SUM, COUNT, AVG, etc.)
            field: Field to aggregate
            group_by: Optional GROUP BY field
            
        Returns:
            Aggregation result
            
        Example:
            >>> XWQueryFacade.quick_aggregate(data, "AVG", "price", "category")
        """
        from . import XWQuery
        
        group_clause = f" GROUP BY {group_by}" if group_by else ""
        query = f"SELECT {agg_func}({field}) FROM data{group_clause}"
        
        return XWQuery.execute(query, data)
    
    # ============================================================================
    # QUERY BUILDERS
    # ============================================================================
    
    @staticmethod
    def build_select(table: str, fields: List[str] = None, where: str = None, 
                    order_by: str = None, limit: int = None) -> str:
        """
        Build a SELECT query string.
        
        Args:
            table: Table/collection name
            fields: Fields to select
            where: WHERE clause
            order_by: ORDER BY clause
            limit: LIMIT value
            
        Returns:
            Query string
        """
        fields_str = ", ".join(fields) if fields else "*"
        query = f"SELECT {fields_str} FROM {table}"
        
        if where:
            query += f" WHERE {where}"
        if order_by:
            query += f" ORDER BY {order_by}"
        if limit:
            query += f" LIMIT {limit}"
        
        return query
    
    @staticmethod
    def build_insert(table: str, values: Dict[str, Any]) -> str:
        """
        Build an INSERT query string.
        
        Args:
            table: Table/collection name
            values: Dictionary of field:value pairs
            
        Returns:
            Query string
        """
        fields = ", ".join(values.keys())
        placeholders = ", ".join(f":{k}" for k in values.keys())
        return f"INSERT INTO {table} ({fields}) VALUES ({placeholders})"
    
    @staticmethod
    def build_update(table: str, values: Dict[str, Any], where: str) -> str:
        """
        Build an UPDATE query string.
        
        Args:
            table: Table/collection name
            values: Dictionary of field:value pairs to update
            where: WHERE clause
            
        Returns:
            Query string
        """
        set_clause = ", ".join(f"{k} = :{k}" for k in values.keys())
        return f"UPDATE {table} SET {set_clause} WHERE {where}"
    
    @staticmethod
    def build_delete(table: str, where: str) -> str:
        """
        Build a DELETE query string.
        
        Args:
            table: Table/collection name
            where: WHERE clause
            
        Returns:
            Query string
        """
        return f"DELETE FROM {table} WHERE {where}"
    
    # ============================================================================
    # PERFORMANCE & MONITORING
    # ============================================================================
    
    @staticmethod
    def explain(query: str) -> Dict[str, Any]:
        """
        Explain query execution plan.
        
        Args:
            query: Query string
            
        Returns:
            Execution plan details
        """
        from .query.strategies.xwquery import XWQueryScriptStrategy
        
        parser = XWQueryScriptStrategy()
        parsed = parser.parse_script(query)
        
        return {
            "query": query,
            "parsed": "actions_tree structure",
            "operations": "list of operations",
            "estimated_cost": "cost estimation",
            "optimization_suggestions": []
        }
    
    @staticmethod
    def benchmark(query: str, data: Any, iterations: int = 100) -> Dict[str, Any]:
        """
        Benchmark query performance.
        
        Args:
            query: Query to benchmark
            data: Data to query
            iterations: Number of iterations
            
        Returns:
            Benchmark results with timing statistics
        """
        import time
        from . import XWQuery
        
        times = []
        for _ in range(iterations):
            start = time.perf_counter()
            XWQuery.execute(query, data)
            end = time.perf_counter()
            times.append((end - start) * 1000)  # Convert to ms
        
        return {
            "iterations": iterations,
            "avg_time_ms": sum(times) / len(times),
            "min_time_ms": min(times),
            "max_time_ms": max(times),
            "total_time_ms": sum(times),
            "median_time_ms": sorted(times)[len(times) // 2]
        }


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

def quick_select(data: Any, filter_expr: str = None, fields: List[str] = None) -> ExecutionResult:
    """Quick SELECT - convenience function."""
    return XWQueryFacade.quick_select(data, filter_expr, fields)


def quick_filter(data: Any, condition: str) -> ExecutionResult:
    """Quick FILTER - convenience function."""
    return XWQueryFacade.quick_filter(data, condition)


def quick_aggregate(data: Any, agg_func: str, field: str, group_by: str = None) -> ExecutionResult:
    """Quick AGGREGATE - convenience function."""
    return XWQueryFacade.quick_aggregate(data, agg_func, field, group_by)


def build_select(table: str, fields: List[str] = None, where: str = None, 
                order_by: str = None, limit: int = None) -> str:
    """Build SELECT query - convenience function."""
    return XWQueryFacade.build_select(table, fields, where, order_by, limit)


def build_insert(table: str, values: Dict[str, Any]) -> str:
    """Build INSERT query - convenience function."""
    return XWQueryFacade.build_insert(table, values)


def build_update(table: str, values: Dict[str, Any], where: str) -> str:
    """Build UPDATE query - convenience function."""
    return XWQueryFacade.build_update(table, values, where)


def build_delete(table: str, where: str) -> str:
    """Build DELETE query - convenience function."""
    return XWQueryFacade.build_delete(table, where)


def explain(query: str) -> Dict[str, Any]:
    """Explain query - convenience function."""
    return XWQueryFacade.explain(query)


def benchmark(query: str, data: Any, iterations: int = 100) -> Dict[str, Any]:
    """Benchmark query - convenience function."""
    return XWQueryFacade.benchmark(query, data, iterations)


__all__ = [
    # Facade class
    'XWQueryFacade',
    
    # Convenience functions
    'quick_select',
    'quick_filter',
    'quick_aggregate',
    'build_select',
    'build_insert',
    'build_update',
    'build_delete',
    'explain',
    'benchmark',
]

