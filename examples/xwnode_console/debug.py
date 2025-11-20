import sys
from pathlib import Path
xwnode_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(xwnode_root / "examples"))

from xwnode_console.console import XWQueryConsole
c = XWQueryConsole(42, verbose=True)
c._execute_query('SELECT * FROM users WHERE age > 30')

