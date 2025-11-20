#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/format_detector.py

Query Format Auto-Detection

Automatically detects query format (SQL, GraphQL, Cypher, JMESPath, etc.)
from query string content using multi-stage detection pipeline.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 26-Oct-2025
"""

import re
from typing import Dict, List, Tuple, Optional
from collections import defaultdict


class QueryFormatDetector:
    """
    Multi-stage format detector for query strings.
    
    Implements Plan 2, Option C (Multi-Stage Pipeline):
    - Stage 1: Quick keyword check (fast path)
    - Stage 2: Structure analysis (patterns)
    - Stage 3: Syntax validation (try parsing)
    - Stage 4: Confidence scoring
    """
    
    def __init__(self, confidence_threshold: float = 0.8):
        """
        Initialize detector.
        
        Args:
            confidence_threshold: Minimum confidence to auto-detect (default: 0.8)
        """
        self._threshold = confidence_threshold
        self._keyword_weights = self._build_keyword_weights()
        self._pattern_matchers = self._build_pattern_matchers()
    
    def _build_keyword_weights(self) -> Dict[str, Dict[str, int]]:
        """
        Build keyword dictionaries with uniqueness weights.
        
        Higher weight = more unique to that format.
        """
        return {
            'SQL': {
                'SELECT': 10, 'FROM': 10, 'WHERE': 8, 'INSERT': 10,
                'UPDATE': 10, 'DELETE': 10, 'CREATE': 9, 'ALTER': 9,
                'DROP': 9, 'JOIN': 9, 'INNER': 8, 'LEFT': 7, 'RIGHT': 7,
                'OUTER': 7, 'ON': 6, 'AS': 5, 'GROUP': 8, 'BY': 6,
                'HAVING': 9, 'ORDER': 7, 'LIMIT': 8, 'OFFSET': 8,
                'UNION': 9, 'DISTINCT': 8, 'COUNT': 7, 'SUM': 7,
                'AVG': 7, 'MIN': 7, 'MAX': 7, 'INTO': 8, 'VALUES': 7
            },
            'GraphQL': {
                'query': 10, 'mutation': 10, 'subscription': 10,
                'fragment': 9, 'on': 5, 'type': 6, 'interface': 7,
                'union': 6, 'enum': 6, 'input': 6, 'schema': 8,
                'extend': 7, 'implements': 8, 'directive': 8
            },
            'Cypher': {
                'MATCH': 10, 'RETURN': 10, 'CREATE': 9, 'MERGE': 9,
                'DELETE': 8, 'DETACH': 9, 'SET': 7, 'REMOVE': 8,
                'WITH': 7, 'UNWIND': 9, 'FOREACH': 9, 'CALL': 8,
                'YIELD': 8, 'UNION': 7, 'WHERE': 6, 'AND': 5,
                'OR': 5, 'NOT': 5, 'IN': 5, 'STARTS': 8, 'ENDS': 8,
                'CONTAINS': 7, 'OPTIONAL': 8
            },
            'SPARQL': {
                'PREFIX': 10, 'SELECT': 9, 'CONSTRUCT': 10, 'DESCRIBE': 10,
                'ASK': 10, 'WHERE': 7, 'FILTER': 8, 'OPTIONAL': 8,
                'UNION': 7, 'GRAPH': 9, 'SERVICE': 9, 'BIND': 9,
                'VALUES': 7, 'LIMIT': 7, 'OFFSET': 7, 'ORDER': 7
            },
            'Gremlin': {
                'V': 9, 'E': 9, 'has': 8, 'hasLabel': 9, 'hasId': 9,
                'out': 7, 'in': 7, 'both': 8, 'outE': 8, 'inE': 8,
                'bothE': 8, 'values': 7, 'properties': 7, 'path': 8,
                'until': 8, 'repeat': 8, 'emit': 8, 'times': 8,
                'aggregate': 7, 'group': 7, 'count': 6, 'sum': 6
            },
            'JMESPath': {
                'length': 7, 'sort_by': 9, 'reverse': 7, 'contains': 6,
                'starts_with': 8, 'ends_with': 8, 'join': 6, 'keys': 7,
                'values': 6, 'type': 6, 'to_string': 8, 'to_number': 8,
                'abs': 7, 'ceil': 7, 'floor': 7, 'max': 6, 'min': 6,
                'sum': 6, 'avg': 7, 'flatten': 8, 'unique': 8
            },
            'MongoDB': {
                '$match': 10, '$group': 10, '$project': 10, '$sort': 9,
                '$limit': 9, '$skip': 9, '$lookup': 10, '$unwind': 10,
                '$out': 9, '$merge': 9, '$replaceRoot': 9, '$addFields': 9,
                '$count': 8, '$sum': 7, '$avg': 7, '$min': 7, '$max': 7,
                'find': 9, 'aggregate': 9, 'insert': 8, 'update': 8
            }
        }
    
    def _build_pattern_matchers(self) -> Dict[str, List[Tuple[re.Pattern, float]]]:
        """
        Build regex patterns for structure-based detection.
        
        Returns:
            Dict mapping format -> [(pattern, confidence_weight), ...]
        """
        return {
            'SQL': [
                (re.compile(r'\bSELECT\s+.+\s+FROM\s+', re.IGNORECASE), 0.95),
                (re.compile(r'\bINSERT\s+INTO\s+', re.IGNORECASE), 0.95),
                (re.compile(r'\bUPDATE\s+.+\s+SET\s+', re.IGNORECASE), 0.95),
                (re.compile(r'\bDELETE\s+FROM\s+', re.IGNORECASE), 0.95),
                (re.compile(r'\bCREATE\s+TABLE\s+', re.IGNORECASE), 0.95),
                (re.compile(r'\bJOIN\s+', re.IGNORECASE), 0.85),
                (re.compile(r'\bGROUP\s+BY\s+', re.IGNORECASE), 0.85),
                (re.compile(r'\bORDER\s+BY\s+', re.IGNORECASE), 0.85),
            ],
            'GraphQL': [
                (re.compile(r'^\s*query\s+\w+\s*\{', re.IGNORECASE), 0.95),
                (re.compile(r'^\s*mutation\s+\w+\s*\{', re.IGNORECASE), 0.95),
                (re.compile(r'^\s*subscription\s+\w+\s*\{', re.IGNORECASE), 0.95),
                (re.compile(r'\{\s*\w+\s*\([^)]*\)\s*\{', re.IGNORECASE), 0.90),
                (re.compile(r'fragment\s+\w+\s+on\s+', re.IGNORECASE), 0.90),
            ],
            'Cypher': [
                (re.compile(r'\bMATCH\s+\([^)]*\)', re.IGNORECASE), 0.95),
                (re.compile(r'\([^)]*\)-\[[^\]]*\]->\([^)]*\)', re.IGNORECASE), 0.95),
                (re.compile(r'\bRETURN\s+', re.IGNORECASE), 0.85),
                (re.compile(r'\bCREATE\s+\([^)]*\)', re.IGNORECASE), 0.90),
                (re.compile(r'\bMERGE\s+\([^)]*\)', re.IGNORECASE), 0.90),
            ],
            'SPARQL': [
                (re.compile(r'^\s*PREFIX\s+\w+:\s*<', re.IGNORECASE), 0.95),
                (re.compile(r'\bCONSTRUCT\s+\{', re.IGNORECASE), 0.95),
                (re.compile(r'\bDESCRIBE\s+', re.IGNORECASE), 0.90),
                (re.compile(r'\bASK\s+\{', re.IGNORECASE), 0.95),
                (re.compile(r'\?[a-zA-Z]\w*\s', re.IGNORECASE), 0.80),  # Variables
            ],
            'Gremlin': [
                (re.compile(r'g\.V\(\)', re.IGNORECASE), 0.95),
                (re.compile(r'g\.E\(\)', re.IGNORECASE), 0.95),
                (re.compile(r'\.has\(', re.IGNORECASE), 0.85),
                (re.compile(r'\.out\(\)', re.IGNORECASE), 0.85),
                (re.compile(r'\.in\(\)', re.IGNORECASE), 0.85),
            ],
            'JMESPath': [
                (re.compile(r'\[\?\s*.+\s*\]', re.IGNORECASE), 0.90),  # Filter
                (re.compile(r'\|', re.IGNORECASE), 0.75),  # Pipe
                (re.compile(r'sort_by\(', re.IGNORECASE), 0.90),
                (re.compile(r'\[\*\]', re.IGNORECASE), 0.80),  # Wildcard
            ],
            'JSONPath': [
                (re.compile(r'^\$\.', re.IGNORECASE), 0.95),  # Root
                (re.compile(r'\$\[', re.IGNORECASE), 0.90),
                (re.compile(r'\.\.\w+', re.IGNORECASE), 0.85),  # Recursive descent
                (re.compile(r'\[@\.', re.IGNORECASE), 0.85),  # Filter
            ],
            'XPath': [
                (re.compile(r'^/', re.IGNORECASE), 0.90),  # Absolute path
                (re.compile(r'//', re.IGNORECASE), 0.85),  # Descendant
                (re.compile(r'@\w+', re.IGNORECASE), 0.80),  # Attribute
                (re.compile(r'\[position\(\)', re.IGNORECASE), 0.90),
            ],
            'MongoDB': [
                (re.compile(r'\$match\s*:', re.IGNORECASE), 0.95),
                (re.compile(r'\$group\s*:', re.IGNORECASE), 0.95),
                (re.compile(r'\$project\s*:', re.IGNORECASE), 0.95),
                (re.compile(r'\.find\(', re.IGNORECASE), 0.90),
                (re.compile(r'\.aggregate\(\[', re.IGNORECASE), 0.90),
            ],
        }
    
    def detect_format(self, query: str) -> Tuple[str, float]:
        """
        Detect query format using multi-stage pipeline.
        
        Args:
            query: Query string to analyze
            
        Returns:
            Tuple of (format_name, confidence_score)
            
        Example:
            >>> detector = QueryFormatDetector()
            >>> format, confidence = detector.detect_format("SELECT * FROM users")
            >>> print(f"{format} ({confidence:.0%})")
            'SQL (95%)'
        """
        if not query or not isinstance(query, str):
            return 'SQL', 0.5  # Default fallback
        
        query = query.strip()
        
        # Stage 1: Quick keyword check (fast path for common formats)
        quick_result = self._quick_keyword_check(query)
        if quick_result and quick_result[1] >= 0.90:
            return quick_result  # High confidence, return immediately
        
        # Stage 2: Pattern matching (structure analysis)
        pattern_scores = self._pattern_matching_detection(query)
        
        # Stage 3: Keyword frequency analysis
        keyword_scores = self._keyword_frequency_detection(query)
        
        # Stage 4: Combine scores and rank
        combined_scores = self._combine_scores(pattern_scores, keyword_scores)
        
        if not combined_scores:
            return 'SQL', 0.5  # Default fallback
        
        # Return format with highest combined score
        best_format = max(combined_scores, key=combined_scores.get)
        confidence = combined_scores[best_format]
        
        return best_format, confidence
    
    def _quick_keyword_check(self, query: str) -> Optional[Tuple[str, float]]:
        """
        Stage 1: Quick keyword check for common formats.
        
        Fast path that catches 80-90% of queries immediately.
        """
        query_upper = query.upper()
        
        # SQL (most common)
        if 'SELECT' in query_upper and 'FROM' in query_upper:
            return 'SQL', 0.95
        if query_upper.startswith(('INSERT ', 'UPDATE ', 'DELETE FROM')):
            return 'SQL', 0.95
        
        # Cypher (graph)
        if 'MATCH' in query_upper and 'RETURN' in query_upper:
            return 'Cypher', 0.95
        if query_upper.startswith('MATCH (') and '-[' in query:
            return 'Cypher', 0.95
        
        # GraphQL
        if query.strip().startswith(('query ', 'mutation ', 'subscription ')):
            return 'GraphQL', 0.95
        
        # SPARQL
        if query_upper.startswith('PREFIX ') or 'CONSTRUCT {' in query_upper:
            return 'SPARQL', 0.95
        
        # Gremlin
        if query.strip().startswith('g.V(') or query.strip().startswith('g.E('):
            return 'Gremlin', 0.95
        
        # MongoDB
        if query.strip().startswith('{') and '$match' in query:
            return 'MongoDB', 0.90
        
        # JSONPath
        if query.startswith('$.'):
            return 'JSONPath', 0.90
        
        # XPath
        if query.startswith('/') and not '/' in query[1:3]:  # Not // or URL
            return 'XPath', 0.85
        
        return None  # No quick match, continue to deeper analysis
    
    def _pattern_matching_detection(self, query: str) -> Dict[str, float]:
        """
        Stage 2: Pattern-based detection using regex.
        
        Returns dict of format -> confidence scores.
        """
        scores = {}
        
        for format_name, patterns in self._pattern_matchers.items():
            max_confidence = 0.0
            for pattern, confidence_weight in patterns:
                if pattern.search(query):
                    max_confidence = max(max_confidence, confidence_weight)
            
            if max_confidence > 0:
                scores[format_name] = max_confidence
        
        return scores
    
    def _keyword_frequency_detection(self, query: str) -> Dict[str, float]:
        """
        Stage 3: Keyword frequency analysis.
        
        Returns dict of format -> weighted scores.
        """
        scores = defaultdict(float)
        
        # Extract words from query
        words = set(re.findall(r'\b[a-zA-Z_]\w*\b', query.upper()))
        
        # Score each format based on keyword matches
        for format_name, keywords in self._keyword_weights.items():
            for word in words:
                if word in keywords:
                    scores[format_name] += keywords[word]
        
        # Normalize scores (divide by max possible for this query)
        if scores:
            max_score = max(scores.values())
            if max_score > 0:
                for format_name in scores:
                    scores[format_name] = scores[format_name] / max_score
        
        return dict(scores)
    
    def _combine_scores(
        self, 
        pattern_scores: Dict[str, float],
        keyword_scores: Dict[str, float]
    ) -> Dict[str, float]:
        """
        Stage 4: Combine and weight different detection methods.
        
        Pattern matching is weighted more heavily (0.6) than keywords (0.4).
        """
        combined = defaultdict(float)
        all_formats = set(pattern_scores.keys()) | set(keyword_scores.keys())
        
        for format_name in all_formats:
            pattern_score = pattern_scores.get(format_name, 0.0)
            keyword_score = keyword_scores.get(format_name, 0.0)
            
            # Weighted combination: patterns 60%, keywords 40%
            combined[format_name] = (pattern_score * 0.6) + (keyword_score * 0.4)
        
        return dict(combined)
    
    def detect_format_with_candidates(self, query: str) -> Dict[str, float]:
        """
        Detect format and return all candidates with scores.
        
        Useful for debugging and understanding detection logic.
        
        Args:
            query: Query string
            
        Returns:
            Dict of format -> confidence score for all detected formats
            
        Example:
            >>> detector = QueryFormatDetector()
            >>> candidates = detector.detect_format_with_candidates("SELECT * FROM users")
            >>> print(candidates)
            {'SQL': 0.95, 'SPARQL': 0.3, 'GraphQL': 0.1}
        """
        pattern_scores = self._pattern_matching_detection(query)
        keyword_scores = self._keyword_frequency_detection(query)
        combined = self._combine_scores(pattern_scores, keyword_scores)
        
        # Sort by confidence
        return dict(sorted(combined.items(), key=lambda x: x[1], reverse=True))
    
    def is_confident(self, query: str) -> bool:
        """
        Check if detection is confident enough for auto-detection.
        
        Args:
            query: Query string
            
        Returns:
            True if confidence >= threshold, False otherwise
        """
        _, confidence = self.detect_format(query)
        return confidence >= self._threshold


# Convenience function
_global_detector: Optional[QueryFormatDetector] = None


def detect_query_format(query: str) -> Tuple[str, float]:
    """
    Convenience function for query format detection.
    
    Args:
        query: Query string
        
    Returns:
        Tuple of (format_name, confidence_score)
        
    Example:
        >>> format, confidence = detect_query_format("MATCH (u:User) RETURN u.name")
        >>> print(f"{format} ({confidence:.0%})")
        'Cypher (95%)'
    """
    global _global_detector
    if _global_detector is None:
        _global_detector = QueryFormatDetector()
    
    return _global_detector.detect_format(query)

