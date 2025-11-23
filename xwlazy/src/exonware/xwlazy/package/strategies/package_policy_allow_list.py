"""
Allow List Policy Strategy

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.19
Generation Date: 15-Nov-2025

Allow list policy - only allows packages in the allow list.
"""

from typing import Tuple, List, Set
from ...package.base import APolicyStrategy


class AllowListPolicy(APolicyStrategy):
    """
    Allow list policy strategy - only allows packages in the allow list.
    
    Only packages explicitly in the allow list can be installed.
    """
    
    def __init__(self, allowed_packages: Set[str]):
        """
        Initialize allow list policy.
        
        Args:
            allowed_packages: Set of allowed package names
        """
        self._allowed = {pkg.lower() for pkg in allowed_packages}
    
    def is_allowed(self, package_name: str) -> Tuple[bool, str]:
        """
        Check if package is allowed to be installed.
        
        Args:
            package_name: Package name to check
            
        Returns:
            Tuple of (allowed: bool, reason: str)
        """
        if package_name.lower() in self._allowed:
            return (True, f"Package '{package_name}' is in allow list")
        return (False, f"Package '{package_name}' is not in allow list")
    
    def get_pip_args(self, package_name: str) -> List[str]:
        """
        Get pip arguments based on policy.
        
        Args:
            package_name: Package name
            
        Returns:
            List of pip arguments (empty for allow list policy)
        """
        return []

