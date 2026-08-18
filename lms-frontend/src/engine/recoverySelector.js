/**
 * Recovery Selector
 */

export const selectRecovery = (rootGapSkill, availableResources, preferences) => {
  // Filter resources that cover the root gap
  const candidates = availableResources.filter(r => r.skillsCovered.includes(rootGapSkill.id));

  if (candidates.length === 0) return null;

  // Calculate coverage for each candidate
  // (In a real system, rootGapSkill would have an array of subSkills. For the prototype, we assume coverage is binary or 100%)
  
  // Sort by:
  // 1. duration ASC (minimize cost)
  // 2. matches learner preference
  candidates.sort((a, b) => {
    // Check if learning style matches preference
    const aMatchesPref = a.learningStyle === preferences.learningPreference ? 1 : 0;
    const bMatchesPref = b.learningStyle === preferences.learningPreference ? 1 : 0;
    
    if (aMatchesPref !== bMatchesPref) {
      return bMatchesPref - aMatchesPref;
    }
    
    // Sort by duration ascending to minimize cost
    return a.durationMinutes - b.durationMinutes;
  });

  // Return the shortest intervention that satisfies preferences, or just the shortest
  return candidates[0];
};
