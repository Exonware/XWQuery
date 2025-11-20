#exonware/xwsyntax/tests/1.unit/engine_tests/conftest.py

"""
Engine test fixtures.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import pytest
from pathlib import Path
import sys

src_path = Path(__file__).parent.parent.parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))


@pytest.fixture
def syntax_engine():
    """Create SyntaxEngine instance."""
    from exonware.xwsyntax import SyntaxEngine
    return SyntaxEngine()

