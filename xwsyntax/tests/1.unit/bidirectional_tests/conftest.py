#exonware/xwsyntax/tests/1.unit/bidirectional_tests/conftest.py

"""
Bidirectional test fixtures.

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
def json_grammar():
    """Load JSON bidirectional grammar."""
    from exonware.xwsyntax import BidirectionalGrammar
    return BidirectionalGrammar.load('json')

