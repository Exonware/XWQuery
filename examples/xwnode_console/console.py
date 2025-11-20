#!/usr/bin/env python3
"""
XWQuery Interactive Console

Main console implementation for interactive XWQuery testing.
"""

import sys
import os
import time
from pathlib import Path
from typing import Optional, Dict, Any

# Configure UTF-8 encoding for Windows console (fix Unicode emoji errors)
# This follows GUIDELINES_DEV.md: Handle emojis gracefully on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        # Python < 3.7 fallback
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Lazy imports - only load XWNode components when needed
# This follows DEV_GUIDELINES.md: "Lazy Loading pattern - Load data only when needed"
# Avoids loading xwsystem dependencies (like lxml) until actually required
from . import data, utils, query_examples


class XWQueryConsole:
    """Interactive XWQuery Console."""
    
    def __init__(self, seed: int = 42, verbose: bool = False):
        """
        Initialize console.
        
        Args:
            seed: Random seed for data generation
            verbose: Enable verbose output
        """
        self.seed = seed
        self.verbose = verbose
        self.node = None
        self.engine = None
        self.parser = None
        self.history = []
        self.collections = {}
        
        self._setup()
    
    def _setup(self):
        """Set up console with data and components."""
        if self.verbose:
            print("Loading data...")
        
        # Load test data
        self.collections = data.load_all_collections(self.seed)
        
        # Lazy initialization - only load XWNode when actually needed
        # Currently using mock execution, so XWNode is not required yet
        # This follows DEV_GUIDELINES.md lazy loading principle
        self.node = None
        self.engine = None
        self.parser = None
        
        if self.verbose:
            stats = data.get_collection_stats(self.collections)
            print(f"Loaded {sum(stats.values())} total records across {len(stats)} collections")
    
    def _ensure_xwnode_loaded(self):
        """
        Lazy load XWNode and XWQuery components when needed for REAL execution.
        
        Following GUIDELINES_DEV.md: Lazy Loading pattern for optimal performance.
        This uses REAL xwquery library, not fake/mock implementations!
        """
        if self.node is None:
            if self.verbose:
                print("[DEBUG] Lazy loading XWNode and XWQuery components...")
            
            # Import XWNode components (packages installed via pip editable mode)
            try:
                from exonware.xwnode import XWNode
            except ImportError as e:
                raise RuntimeError(
                    "XWNode library not found. Install with: pip install -e ../../../xwnode\n"
                    f"Error: {e}"
                )
            
            # Import XWQuery execution engine - THE REAL ONE!
            # NOTE: This is production xwquery, not a mock/fake!
            try:
                from exonware.xwquery.query.executors.engine import ExecutionEngine
                from exonware.xwquery.contracts import ExecutionContext
                from exonware.xwquery.query.strategies.xwquery import XWQueryScriptStrategy
                
                if self.verbose:
                    print("[DEBUG] ✅ Real XWQuery execution engine imported successfully")
                    print(f"[DEBUG]    ExecutionEngine: {ExecutionEngine}")
                    print(f"[DEBUG]    XWQueryScriptStrategy: {XWQueryScriptStrategy}")
                
            except ImportError as e:
                raise RuntimeError(
                    "XWQuery library not found or incomplete. Install with: pip install -e ../../../xwquery\n"
                    f"Error: {e}"
                )
            
            # Create XWNode with HASH_MAP strategy for fast lookups
            # Following GUIDELINES_DEV.md: Use appropriate data structures
            self.node = XWNode.from_native(self.collections)
            
            if self.verbose:
                print(f"[DEBUG] XWNode created with {len(self.collections)} collections")
                print(f"[DEBUG] Node: {type(self.node).__name__}")
            
            # Initialize REAL ExecutionEngine (not a mock!)
            self.engine = ExecutionEngine()
            
            # Initialize XWQuery parser
            self.parser = XWQueryScriptStrategy()
            
            if self.verbose:
                print("[DEBUG] ✅ XWNode and XWQuery components loaded successfully")
                print(f"[DEBUG]    Engine: {type(self.engine).__name__}")
                print(f"[DEBUG]    Parser: {type(self.parser).__name__}")
    
    def run(self):
        """Run the interactive console."""
        utils.print_banner()
        
        stats = data.get_collection_stats(self.collections)
        utils.print_collections_info(stats)
        
        utils.print_help()
        
        print("Ready! Type your XWQuery script or a command (starting with '.'):")
        print("(Multi-line mode: End with semicolon ';' or type on single line)\n")
        
        while True:
            try:
                # Support multi-line input
                query_lines = []
                while True:
                    if not query_lines:
                        prompt = "XWQuery> "
                    else:
                        prompt = "      -> "
                    
                    line = input(prompt).strip()
                    
                    if not line:
                        if query_lines:
                            # Empty line in multi-line mode - execute
                            break
                        else:
                            # Empty line at start - skip
                            continue
                    
                    # Check for commands (only on first line)
                    if not query_lines and line.startswith('.'):
                        self._handle_command(line)
                        break
                    
                    query_lines.append(line)
                    
                    # Check if query is complete (ends with semicolon or single line)
                    if line.endswith(';') or (len(query_lines) == 1 and not self._needs_continuation(line)):
                        break
                
                # Join multi-line query
                if query_lines:
                    query = ' '.join(query_lines).rstrip(';').strip()
                    
                    if query:
                        self._execute_query(query)
                        # Add to history
                        self.history.append(query)
            
            except (KeyboardInterrupt, EOFError):
                print("\n\nExiting XWQuery Console. Goodbye!")
                break
            except Exception as e:
                print(utils.format_error(e))
                if self.verbose:
                    import traceback
                    traceback.print_exc()
    
    def _needs_continuation(self, line: str) -> bool:
        """Check if line needs continuation (multi-line query)."""
        # If line ends with comma, needs continuation
        if line.endswith(','):
            return True
        
        # If it has opening but no closing parenthesis/bracket
        open_count = line.count('(') - line.count(')')
        if open_count > 0:
            return True
        
        # Keywords that suggest continuation
        continuation_keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP', 'ORDER', 'HAVING', 'AND', 'OR']
        line_upper = line.upper()
        
        # If starts with keyword but doesn't seem complete
        for keyword in continuation_keywords:
            if line_upper.startswith(keyword) and len(line.split()) < 4:
                return True
        
        return False
    
    def _handle_command(self, command: str):
        """Handle special console commands."""
        parts = command.split(maxsplit=1)
        cmd = parts[0].lower()
        arg = parts[1] if len(parts) > 1 else None
        
        if cmd == '.help':
            utils.print_help()
        
        elif cmd == '.collections':
            stats = data.get_collection_stats(self.collections)
            utils.print_collections_info(stats)
        
        elif cmd == '.show':
            if not arg:
                print("Usage: .show <collection_name>")
                return
            
            if arg in self.collections:
                utils.print_collection_sample(arg, self.collections[arg], sample_size=10)
            else:
                print(f"Collection '{arg}' not found")
                print(f"Available: {', '.join(self.collections.keys())}")
        
        elif cmd == '.examples':
            if arg:
                query_examples.print_examples(arg)
            else:
                self._print_all_operations()
        
        elif cmd == '.clear':
            utils.clear_screen()
            utils.print_banner()
        
        elif cmd == '.exit' or cmd == '.quit':
            print("\nExiting XWQuery Console. Goodbye!")
            sys.exit(0)
        
        elif cmd == '.history':
            print("\nQuery History:")
            for i, h in enumerate(self.history[-20:], 1):
                print(f"{i}. {h}")
        
        elif cmd == '.random':
            desc, query = query_examples.get_random_example()
            print(f"\nRandom Example: {desc}")
            print(f"{query}\n")
        
        else:
            print(f"Unknown command: {cmd}")
            print("Type .help for available commands")
    
    def _print_all_operations(self):
        """Print all 56 XWQuery operations with examples."""
        print("\n" + "=" * 80)
        print("ALL 56 XWQUERY OPERATIONS")
        print("=" * 80 + "\n")
        
        print("CORE OPERATIONS (1-6):")
        print("  1.  SELECT * FROM users              # Query and retrieve data")
        print("  2.  INSERT INTO users (name: 'Bob') # Insert new records")
        print("  3.  UPDATE users SET age = 31        # Update existing records")
        print("  4.  DELETE FROM users WHERE age < 18 # Delete records")
        print("  5.  CREATE COLLECTION products       # Create collections/structures")
        print("  6.  DROP INDEX user_index            # Drop structures")
        print()
        
        print("FILTERING OPERATIONS (7-16):")
        print("  7.  WHERE age > 30                   # Filter by condition")
        print("  8.  FILTER users BY status           # General filtering")
        print("  9.  LIKE 'John%'                     # Pattern matching")
        print("  10. IN [1, 2, 3]                     # Membership testing")
        print("  11. HAS email                        # Check property exists")
        print("  12. BETWEEN 20 AND 40                # Range check (inclusive)")
        print("  13. RANGE 1 TO 100                   # Range operations")
        print("  14. TERM 'search'                    # Term matching")
        print("  15. OPTIONAL phone                   # Optional matching")
        print("  16. VALUES [1, 2, 3]                 # Value operations")
        print()
        
        print("AGGREGATION OPERATIONS (17-25):")
        print("  17. COUNT users                      # Count records")
        print("  18. SUM sales.amount                 # Sum numeric values")
        print("  19. AVG users.age                    # Calculate average")
        print("  20. MIN prices.value                 # Find minimum")
        print("  21. MAX scores.points                # Find maximum")
        print("  22. DISTINCT users.city              # Get unique values")
        print("  23. GROUP BY department              # Group records")
        print("  24. HAVING count > 5                 # Filter grouped data")
        print("  25. SUMMARIZE sales BY region        # Generate summaries")
        print()
        
        print("PROJECTION OPERATIONS (26-27):")
        print("  26. PROJECT id, name, email          # Select specific fields")
        print("  27. EXTEND fullName = firstName + lastName  # Add computed fields")
        print()
        
        print("ORDERING OPERATIONS (28-29):")
        print("  28. ORDER BY age DESC                # Sort results")
        print("  29. BY score ASC, name DESC          # Multi-field ordering")
        print()
        
        print("GRAPH OPERATIONS (30-34):")
        print("  30. MATCH (user)-[friend]-(other)    # Pattern matching")
        print("  31. PATH user TO destination         # Path operations")
        print("  32. OUT follows                      # Outbound traversal")
        print("  33. IN followed_by                   # Inbound traversal")
        print("  34. RETURN user.name, friend.name    # Return graph results")
        print()
        
        print("DATA OPERATIONS (35-38):")
        print("  35. LOAD FROM 'data.json'            # Load external data")
        print("  36. STORE TO 'output.json'           # Store to external file")
        print("  37. MERGE users WITH customers       # Merge datasets")
        print("  38. ALTER users ADD COLUMN status    # Alter structures")
        print()
        
        print("ARRAY OPERATIONS (39-40):")
        print("  39. users[0:10]                      # Array slicing")
        print("  40. products[5]                      # Array indexing")
        print()
        
        print("ADVANCED OPERATIONS (41-56):")
        print("  41. JOIN users WITH orders ON user_id           # Join datasets")
        print("  42. UNION users, customers                      # Union operations")
        print("  43. WITH temp AS (SELECT ...) SELECT FROM temp  # Common Table Expressions")
        print("  44. AGGREGATE sum, avg, count BY category       # Multiple aggregations")
        print("  45. FOREACH user IN users DO ...                # Iterate collections")
        print("  46. LET total = sum(prices)                     # Variable assignment")
        print("  47. FOR i IN 1..10 DO ...                       # For loops")
        print("  48. WINDOW OVER (PARTITION BY dept ORDER BY salary) # Window functions")
        print("  49. DESCRIBE users                              # Describe structure")
        print("  50. CONSTRUCT {name: user.name}                 # Construct new objects")
        print("  51. ASK IF EXISTS user WHERE id = 1             # Boolean queries")
        print("  52. SUBSCRIBE TO users WHEN changed             # Subscribe to changes")
        print("  53. SUBSCRIPTION users ON INSERT                # Subscription management")
        print("  54. MUTATION users SET status = 'active'        # Mutation operations")
        print("  55. users | filter | map | reduce               # Pipeline operations")
        print("  56. OPTIONS limit=10 timeout=5000               # Query options")
        print()
        
        print("=" * 80)
        print("TIP: Try SELECT * FROM users (Operation #1)")
        print("=" * 80 + "\n")
    
    def _execute_query(self, query: str):
        """
        Parse and execute a query using the REAL XWQuery execution engine.
        
        This uses actual xwquery features, not mock/fake execution!
        Following GUIDELINES_DEV.md: Real implementation, not workarounds.
        
        Args:
            query: XWQuery script to execute
        """
        try:
            start_time = time.time()
            
            # Lazy load XWNode components for real execution
            self._ensure_xwnode_loaded()
            
            if not self.engine:
                raise RuntimeError("XWQuery execution engine not available. Install with: pip install -e ../../../xwquery")
            
            if self.verbose:
                print(f"[DEBUG] Executing query with REAL XWQuery engine: {query}")
                print(f"[DEBUG] Engine type: {type(self.engine)}")
            
            # Use REAL ExecutionEngine.execute() method!
            # This is the production xwquery execution path
            result = self.engine.execute(query, self.node)
            
            execution_time = time.time() - start_time
            
            if self.verbose:
                print(f"[DEBUG] Execution completed in {execution_time:.4f}s")
                print(f"[DEBUG] Result type: {type(result)}")
            
            # Display results
            result_data = result.data if hasattr(result, 'data') else result
            print("\n" + utils.format_results(result_data))
            print("\n" + utils.format_execution_time(execution_time))
            
            # Show execution status
            if hasattr(result, 'success'):
                status = "✅ Success" if result.success else "❌ Failed"
                print(f"Status: {status}")
                if hasattr(result, 'error') and result.error:
                    print(f"Error: {result.error}")
            print()
        
        except Exception as e:
            print(utils.format_error(e))
            if self.verbose:
                import traceback
                traceback.print_exc()
    


def main(seed: int = 42, verbose: bool = False):
    """
    Main entry point for console.
    
    Args:
        seed: Random seed for data generation
        verbose: Enable verbose output
    """
    console = XWQueryConsole(seed=seed, verbose=verbose)
    console.run()


if __name__ == '__main__':
    main()

