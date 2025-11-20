#!/usr/bin/env python3
"""
#exonware/xwquery/tests/test_xwnode_integration.py

Integration test for xwquery optimization with xwnode strategies

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.6
Generation Date: 27-Oct-2025
"""

import pytest
from exonware.xwquery.query.optimization import (
    QueryCache,
    InMemoryStatisticsManager,
    QueryPlanner,
    SimpleCostModel,
    OptimizationLevel
)


class TestQueryCacheXWNodeIntegration:
    """Test QueryCache with xwnode LRU_CACHE strategy"""
    
    def test_create_cache_with_xwnode(self):
        """Test creating cache with xwnode enabled"""
        cache = QueryCache(max_size=100, use_xwnode=True)
        assert cache is not None
        assert cache._use_xwnode is True
    
    def test_cache_put_and_get(self):
        """Test basic cache operations with xwnode"""
        cache = QueryCache(max_size=10, use_xwnode=True)
        
        # Put query result
        cache.put("SELECT * FROM users", {"result": "test_data"})
        
        # Get from cache
        result = cache.get("SELECT * FROM users")
        assert result == {"result": "test_data"}
    
    def test_cache_eviction(self):
        """Test LRU eviction works correctly"""
        cache = QueryCache(max_size=3, use_xwnode=True)
        
        # Fill cache
        cache.put("query1", "result1")
        cache.put("query2", "result2")
        cache.put("query3", "result3")
        
        # Add one more (should evict query1)
        cache.put("query4", "result4")
        
        # query1 should be evicted
        assert cache.get("query1") is None
        # Others should exist
        assert cache.get("query2") == "result2"
        assert cache.get("query3") == "result3"
        assert cache.get("query4") == "result4"
    
    def test_cache_stats(self):
        """Test cache statistics tracking"""
        cache = QueryCache(max_size=10, use_xwnode=True)
        
        cache.put("query1", "result1")
        
        # Hit
        cache.get("query1")
        # Miss
        cache.get("query2")
        
        stats = cache.get_stats()
        assert stats['hits'] == 1
        assert stats['misses'] == 1
        assert 0 < stats['hit_rate'] <= 1.0


class TestStatisticsManagerXWNodeIntegration:
    """Test StatisticsManager with xwnode HASH_MAP strategy"""
    
    def test_create_stats_manager_with_xwnode(self):
        """Test creating stats manager with xwnode enabled"""
        stats_mgr = InMemoryStatisticsManager(use_xwnode=True)
        assert stats_mgr is not None
    
    async def test_set_and_get_table_statistics(self):
        """Test table statistics storage with xwnode HASH_MAP"""
        stats_mgr = InMemoryStatisticsManager(use_xwnode=True)
        
        # Set statistics
        stats_mgr.set_table_statistics('users', row_count=10000)
        
        # Get statistics
        row_count = await stats_mgr.get_table_row_count('users')
        assert row_count == 10000
    
    async def test_set_and_get_column_statistics(self):
        """Test column statistics storage with xwnode"""
        stats_mgr = InMemoryStatisticsManager(use_xwnode=True)
        
        # Set column stats
        stats_mgr.set_column_statistics('users', 'age', cardinality=50, null_fraction=0.01)
        
        # Get column stats
        cardinality = await stats_mgr.get_column_cardinality('users', 'age')
        null_fraction = await stats_mgr.get_column_null_fraction('users', 'age')
        assert cardinality == 50
        assert null_fraction == 0.01
    
    async def test_index_registration(self):
        """Test index tracking with xwnode"""
        stats_mgr = InMemoryStatisticsManager(use_xwnode=True)
        
        # Register index
        stats_mgr.register_index('users', 'email')
        
        # Check index
        assert await stats_mgr.has_index('users', 'email') is True
        assert await stats_mgr.has_index('users', 'name') is False
    
    async def test_multiple_tables(self):
        """Test handling multiple tables with xwnode"""
        stats_mgr = InMemoryStatisticsManager(use_xwnode=True)
        
        # Set stats for multiple tables
        stats_mgr.set_table_statistics('users', row_count=1000)
        stats_mgr.set_table_statistics('orders', row_count=5000)
        stats_mgr.set_table_statistics('products', row_count=200)
        
        # Verify all are stored correctly
        assert await stats_mgr.get_table_row_count('users') == 1000
        assert await stats_mgr.get_table_row_count('orders') == 5000
        assert await stats_mgr.get_table_row_count('products') == 200


class TestOptimizationPipelineIntegration:
    """Test complete optimization pipeline with xwnode"""
    
    def test_planner_with_xwnode_stats(self):
        """Test query planner with xwnode-backed statistics"""
        stats_mgr = InMemoryStatisticsManager(use_xwnode=True)
        cost_model = SimpleCostModel(stats_mgr)
        planner = QueryPlanner(cost_model, stats_mgr)
        
        # Set up statistics
        stats_mgr.set_table_statistics('users', row_count=10000)
        stats_mgr.set_column_statistics('users', 'age', cardinality=50)
        
        # Planner should work without errors
        assert planner is not None
    
    async def test_cache_and_stats_work_together(self):
        """Test cache and stats manager both using xwnode"""
        # Create both with xwnode
        cache = QueryCache(max_size=10, use_xwnode=True)
        stats_mgr = InMemoryStatisticsManager(use_xwnode=True)
        
        # Use both
        stats_mgr.set_table_statistics('users', row_count=1000)
        cache.put("query1", "result1")
        
        # Both should work
        assert cache.get("query1") == "result1"
        assert await stats_mgr.get_table_row_count('users') == 1000


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

