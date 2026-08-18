/**
 * Blockage Detector
 */
import { getDownstreamNodes } from './graphEngine';

export const classifySkillState = (skillState, graph, currentPath) => {
  const node = graph.nodes[skillState.skillId];
  if (!node) return 'OK';

  if (skillState.masteryScore >= node.masteryThreshold) {
    if (skillState.lastPracticedAt) {
      const daysSince = (Date.now() - new Date(skillState.lastPracticedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) return 'REFRESH_NEEDED';
    }
    return 'OK';
  }

  // Below threshold — is it actually blocking?
  const downstreamSkills = getDownstreamNodes(graph, skillState.skillId);
  
  // Count how many downstream skills are on the current path AND not yet completed
  let blockingCount = 0;
  for (const dsId of downstreamSkills) {
    const pathNode = currentPath.find(pn => pn.skillId === dsId);
    if (pathNode && pathNode.status !== 'completed' && pathNode.status !== 'skipped') {
      blockingCount++;
    }
  }

  if (blockingCount >= 2 || (blockingCount >= 1 && node.goalRelevance > 0.7)) {
    return 'WEAK_AND_BLOCKING'; // triggers recovery
  }

  return 'WEAK_NOT_BLOCKING'; // continue
};
