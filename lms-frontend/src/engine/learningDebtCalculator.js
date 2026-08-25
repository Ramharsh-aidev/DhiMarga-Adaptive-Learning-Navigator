/**
 * Learning Debt Calculator
 */

export const calculateLearningDebt = (learnerState, capabilityGraph) => {
  const debtItems = [];
  
  if (!capabilityGraph || !capabilityGraph.nodes) return debtItems;

  // Find maximum dependency count in the graph to normalize impact
  let maxDependencyCount = 1;
  Object.values(capabilityGraph.nodes).forEach(node => {
    // Simple direct unlock count for prototype
    if (node.unlocks && node.unlocks.length > maxDependencyCount) {
      maxDependencyCount = node.unlocks.length;
    }
  });

  Object.values(learnerState).forEach(skill => {
    const node = capabilityGraph.nodes[skill.skillId];
    if (!node) return;

    if (skill.masteryScore < node.masteryThreshold) {
      const gap = (node.masteryThreshold - skill.masteryScore) / 100;
      const goalRelevance = node.goalRelevance || 0.5;
      const depImpact = (node.unlocks.length) / maxDependencyCount;
      
      const risk = gap * goalRelevance * (depImpact + 0.1); // Add baseline impact
      
      let severity = 'LOW';
      if (risk > 0.25) severity = 'HIGH';
      else if (risk > 0.10) severity = 'MEDIUM';

      debtItems.push({
        skillId: skill.skillId,
        skillName: node.label,
        gap: Math.round(gap * 100),
        severity,
        riskScore: risk
      });
    }
  });

  // Sort by risk descending
  return debtItems.sort((a, b) => b.riskScore - a.riskScore);
};

export const calculateGoalReadiness = (learnerState, capabilityGraph, currentPath) => {
  let earnedSum = 0;
  let possibleSum = 0;

  if (!capabilityGraph || !capabilityGraph.nodes) return 0;

  const nodesToEvaluate = currentPath && currentPath.length > 0 
    ? currentPath.map(p => capabilityGraph.nodes[p.skillId]).filter(Boolean)
    : Object.values(capabilityGraph.nodes);

  nodesToEvaluate.forEach(node => {
    const state = learnerState[node.id];
    const relevance = node.goalRelevance || 0.5;
    
    possibleSum += (node.masteryThreshold * relevance);
    
    if (state && state.masteryScore) {
      // Don't cap at threshold, allow going above but up to 100
      earnedSum += (Math.min(100, state.masteryScore) * relevance);
    }
  });

  if (possibleSum === 0) return 0;
  
  const readiness = (earnedSum / possibleSum) * 100;
  return Math.round(Math.min(100, Math.max(0, readiness)));
};
