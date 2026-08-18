/**
 * Path Optimizer
 */
import { topologicalSort } from './graphEngine';
import { getResourcesForSkill } from '../data/resources';

export const generatePath = (goal, learnerState, graph) => {
  const sorted = topologicalSort(graph);
  
  // Remove already-verified skills
  const remaining = sorted.filter(skillId => {
    const state = learnerState[skillId];
    return !(state && state.status === 'verified');
  });

  const path = [];
  let totalEstimatedHours = 0;

  for (let i = 0; i < remaining.length; i++) {
    const skillId = remaining[i];
    const node = graph.nodes[skillId];
    
    // Select best resource for time estimation
    const resources = getResourcesForSkill(skillId);
    let selectedResource = null;
    let estimatedHours = 2; // default
    
    if (resources && resources.length > 0) {
      // Find the best matching resource, prefer course or one matching style
      selectedResource = resources.find(r => r.learningStyle === goal.learningPreference) || resources[0];
      estimatedHours = selectedResource.durationMinutes / 60;
    }
    
    path.push({
      skillId,
      order: i,
      status: i === 0 ? 'current' : 'upcoming', // first one is current
      estimatedHours,
      selectedResource,
      isUserAdded: false,
      isRecovery: false,
      nodeRef: node
    });
    
    totalEstimatedHours += estimatedHours;
  }

  // Handle budget constraints
  if (totalEstimatedHours > goal.totalBudgetHours) {
    // We would deprioritize low relevance skills here
    // For simplicity in prototype, we'll mark them as 'deprioritized' if they have low relevance
    path.forEach(item => {
      if (item.nodeRef.goalRelevance < 0.7 && totalEstimatedHours > goal.totalBudgetHours) {
        item.status = 'skipped';
        totalEstimatedHours -= item.estimatedHours;
      }
    });
  }

  return path;
};

export const replanPath = (currentPath, learnerState, graph) => {
  // Remove now-verified skills
  let newPath = currentPath.filter(item => {
    const state = learnerState[item.skillId];
    return !(state && state.status === 'verified');
  });

  // Keep any manually skipped/added properties if possible, but recalculate status
  newPath.forEach((item, index) => {
    if (item.status !== 'skipped' && item.status !== 'completed') {
      item.status = index === 0 ? 'current' : 'upcoming';
    }
  });

  return newPath;
};
