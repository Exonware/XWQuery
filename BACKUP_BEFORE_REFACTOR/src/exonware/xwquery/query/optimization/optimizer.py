"""
Query Optimizer

Applies optimization rules to execution plans.

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Version:** 0.0.1.5
"""

from typing import Optional, List
import asyncio

from .base import AOptimizer, AOptimizationRule
from .contracts import (
    IExecutionPlan,
    ICostModel,
    IStatisticsManager,
    IOptimizationRule,
    IPlanNode,
)
from .defs import OptimizationLevel, PlanNodeType
from .rules import (
    PredicatePushdownRule,
    ProjectionPushdownRule,
    IndexSelectionRule,
)


class QueryOptimizer(AOptimizer):
    """
    Optimizes execution plans using a series of optimization rules
    """
    
    def __init__(
        self,
        cost_model: Optional[ICostModel] = None,
        statistics_manager: Optional[IStatisticsManager] = None,
        optimization_level: OptimizationLevel = OptimizationLevel.STANDARD
    ):
        super().__init__(cost_model, statistics_manager)
        self._optimization_level = optimization_level
        self._setup_default_rules()
    
    def _setup_default_rules(self):
        """Setup default optimization rules based on optimization level"""
        if self._optimization_level == OptimizationLevel.NONE:
            return
        
        if self._optimization_level in [OptimizationLevel.BASIC, OptimizationLevel.STANDARD, OptimizationLevel.AGGRESSIVE]:
            # Basic rules
            self.add_rule(PredicatePushdownRule())
            self.add_rule(ProjectionPushdownRule())
        
        if self._optimization_level in [OptimizationLevel.STANDARD, OptimizationLevel.AGGRESSIVE]:
            # Standard rules
            if self._statistics_manager:
                self.add_rule(IndexSelectionRule(self._statistics_manager))
        
        if self._optimization_level == OptimizationLevel.AGGRESSIVE:
            # Aggressive rules
            # Add more advanced rules here
            pass
    
    async def optimize(self, plan: IExecutionPlan) -> IExecutionPlan:
        """
        Apply all optimization rules to the plan
        
        Applies rules iteratively until no more improvements are made
        """
        if self._optimization_level == OptimizationLevel.NONE:
            return plan
        
        current_plan = plan
        max_iterations = 10
        iteration = 0
        
        while iteration < max_iterations:
            improved = False
            
            for rule in self._rules:
                if rule.is_applicable(current_plan):
                    optimized_plan = await rule.apply(current_plan)
                    if optimized_plan is not None:
                        # Check if optimization improved the plan
                        if optimized_plan.get_estimated_cost() < current_plan.get_estimated_cost():
                            current_plan = optimized_plan
                            improved = True
                        elif optimized_plan != current_plan:
                            # Even if cost is same, apply logical optimizations
                            current_plan = optimized_plan
                            improved = True
            
            if not improved:
                break
            
            iteration += 1
        
        return current_plan

