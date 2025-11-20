#!/usr/bin/env python3
"""
Test xwnode integration with ASTNode.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Date: October 29, 2025
"""

import pytest
from exonware.xwsyntax.syntax_tree import ASTNode, create_immutable_ast


class TestASTNodeBackwardCompatibility:
    """Test that existing ASTNode API still works."""
    
    def test_create_simple_node(self):
        """Test creating a simple node."""
        node = ASTNode(type='Module', value='main')
        assert node.type == 'Module'
        assert node.value == 'main'
    
    def test_create_node_with_children(self):
        """Test creating node with children."""
        child1 = ASTNode(type='FunctionDecl', value='func1')
        child2 = ASTNode(type='Variable', value='x')
        parent = ASTNode(type='Module', children=[child1, child2])
        
        assert len(parent.children) == 2
        assert parent.children[0].value == 'func1'
        assert parent.children[1].value == 'x'
    
    def test_find_all(self):
        """Test find_all method."""
        ast = ASTNode(
            type='Module',
            children=[
                ASTNode(type='FunctionDecl', value='func1'),
                ASTNode(type='FunctionDecl', value='func2'),
                ASTNode(type='Variable', value='x'),
            ]
        )
        
        functions = ast.find_all('FunctionDecl')
        assert len(functions) == 2
        assert functions[0].value == 'func1'
        assert functions[1].value == 'func2'
    
    def test_find_first(self):
        """Test find_first method."""
        ast = ASTNode(
            type='Module',
            children=[
                ASTNode(type='Variable', value='x'),
                ASTNode(type='FunctionDecl', value='func1'),
                ASTNode(type='FunctionDecl', value='func2'),
            ]
        )
        
        func = ast.find_first('FunctionDecl')
        assert func is not None
        assert func.value == 'func1'
    
    def test_to_dict(self):
        """Test to_dict method."""
        node = ASTNode(
            type='Module',
            value='main',
            metadata={'line': 1}
        )
        
        data = node.to_dict()
        assert data['type'] == 'Module'
        assert data['value'] == 'main'
        assert data['metadata'] == {'line': 1}
    
    def test_from_dict(self):
        """Test from_dict method."""
        data = {
            'type': 'Module',
            'value': 'main',
            'children': [
                {'type': 'FunctionDecl', 'value': 'func1'}
            ],
            'metadata': {'line': 1}
        }
        
        node = ASTNode.from_dict(data)
        assert node.type == 'Module'
        assert node.value == 'main'
        assert len(node.children) == 1
        assert node.children[0].value == 'func1'
    
    def test_transform(self):
        """Test transform method."""
        ast = ASTNode(
            type='Module',
            children=[
                ASTNode(type='FunctionDecl', value='func1'),
            ]
        )
        
        def add_metadata(node):
            node.metadata['transformed'] = True
            return node
        
        transformed = ast.transform(add_metadata)
        assert transformed.metadata.get('transformed') == True


class TestXWNodeIntegration:
    """Test new xwnode-powered capabilities."""
    
    def test_has_xwnode_backend(self):
        """Test that ASTNode has xwnode backend."""
        node = ASTNode(type='Module')
        assert node._xwnode is not None
    
    def test_as_xwnode(self):
        """Test as_xwnode method."""
        node = ASTNode(type='Module', value='main')
        xwnode = node.as_xwnode()
        
        assert xwnode is not None
        # Verify it's a real XWNode
        from exonware.xwnode import XWNode
        assert isinstance(xwnode, XWNode)
    
    def test_merge_nodes(self):
        """Test merge method."""
        ast1 = ASTNode(
            type='Module',
            children=[ASTNode(type='FunctionDecl', value='func1')]
        )
        ast2 = ASTNode(
            type='Module',
            children=[ASTNode(type='Variable', value='x')]
        )
        
        merged = ast1.merge(ast2, strategy='DEEP')
        assert merged.type == 'Module'
        # Both children should be in merged result
        assert len(merged.children) >= 1
    
    def test_diff_nodes(self):
        """Test diff method."""
        ast1 = ASTNode(
            type='Module',
            children=[ASTNode(type='FunctionDecl', value='func1')]
        )
        ast2 = ASTNode(
            type='Module',
            children=[ASTNode(type='FunctionDecl', value='func2')]
        )
        
        diff = ast1.diff(ast2)
        assert diff is not None
        assert hasattr(diff, 'total_changes')
    
    def test_create_immutable_ast(self):
        """Test create_immutable_ast factory."""
        data = {
            'type': 'Module',
            'value': 'main',
            'children': [
                {'type': 'FunctionDecl', 'value': 'func1'}
            ]
        }
        
        ast = create_immutable_ast(data)
        assert ast.type == 'Module'
        assert ast.value == 'main'
        assert len(ast.children) == 1
        
        # Transform should create new tree (COW)
        def rename(node):
            if node.type == 'FunctionDecl':
                node.value = 'renamed'
            return node
        
        transformed = ast.transform(rename)
        # Original should be unchanged
        original_func = ast.find_first('FunctionDecl')
        transformed_func = transformed.find_first('FunctionDecl')
        
        assert original_func.value == 'func1'
        assert transformed_func.value == 'renamed'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

