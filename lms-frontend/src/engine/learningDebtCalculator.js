/**
 * Learning Debt Calculator
 */

export const calculateLearningDebt = (learnerState, capabilityGraph, currentPath = []) => {
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

  // Track skills that are currently active/upcoming in the path
  const activeSkills = new Set();
  if (currentPath && currentPath.length > 0) {
    currentPath.forEach(node => {
      const ls = learnerState[node.skillId];
      if (!ls || ls.status !== 'verified') {
        activeSkills.add(node.skillId);
      }
    });
  }

  Object.values(learnerState).forEach(skill => {
    const node = capabilityGraph.nodes[skill.skillId];
    if (!node) return;

    // We consider it a debt if mastery is below threshold, and the user has ATTEMPTED it or it's explicitly a gap
    if (skill.masteryScore < node.masteryThreshold && (skill.status === 'gap' || skill.evidenceLevel !== 'none')) {
      const gap = (node.masteryThreshold - skill.masteryScore) / 100;
      const goalRelevance = node.goalRelevance || 0.5;
      const depImpact = (node.unlocks ? node.unlocks.length : 0) / maxDependencyCount;
      
      const risk = gap * goalRelevance * (depImpact + 0.1); // Add baseline impact
      
      let severity = 'LOW';
      if (risk > 0.25) severity = 'HIGH';
      else if (risk > 0.10) severity = 'MEDIUM';

      // Weak vs Blocking Detection
      let isBlocking = false;
      const blockedSkills = [];
      
      if (node.unlocks) {
        node.unlocks.forEach(unlockedId => {
          if (activeSkills.has(unlockedId)) {
            isBlocking = true;
            blockedSkills.push(unlockedId);
          }
        });
      }

      const type = isBlocking ? 'BLOCKING' : 'WEAK';

      debtItems.push({
        skillId: skill.skillId,
        skillName: node.label,
        gap: Math.round(gap * 100),
        severity,
        riskScore: risk,
        type,
        blockedSkills
      });
    }
  });

  // Sort by risk descending
  return debtItems.sort((a, b) => b.riskScore - a.riskScore);
};

export const diagnoseRootCause = (failedSkillId, learnerState, capabilityGraph) => {
  if (!capabilityGraph || !capabilityGraph.nodes) return [];
  
  const rootCauses = [];
  const visited = new Set();
  
  const trace = (skillId) => {
    if (visited.has(skillId)) return;
    visited.add(skillId);
    
    const node = capabilityGraph.nodes[skillId];
    if (!node) return;
    
    const state = learnerState[skillId];
    // If state exists and is a gap
    if (state && state.masteryScore < node.masteryThreshold && state.status === 'gap') {
      rootCauses.push({
        skillId,
        skillName: node.label,
        gap: node.masteryThreshold - state.masteryScore
      });
    }
    
    if (node.prerequisites) {
      node.prerequisites.forEach(pre => trace(pre));
    }
  };
  
  const failedNode = capabilityGraph.nodes[failedSkillId];
  if (failedNode && failedNode.prerequisites) {
    failedNode.prerequisites.forEach(pre => trace(pre));
  }
  
  // Sort by gap descending (biggest gap first)
  return rootCauses.sort((a, b) => b.gap - a.gap);
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
