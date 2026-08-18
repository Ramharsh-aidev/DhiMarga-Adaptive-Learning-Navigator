/**
 * Mastery Calculator
 */

export const calculateMastery = (skillState) => {
  // mastery = weighted average of:
  // assessmentScore    × 0.40
  // practiceScore      × 0.30
  // conceptScore       × 0.15
  // retentionFactor    × 0.15

  const assessmentScore = skillState.assessmentScore || 0;
  const practiceScore = skillState.practiceScore || 0;
  const conceptScore = skillState.conceptScore || 0;
  
  let daysSinceLastPractice = 0;
  if (skillState.lastPracticedAt) {
    const msDiff = Date.now() - new Date(skillState.lastPracticedAt).getTime();
    daysSinceLastPractice = msDiff / (1000 * 60 * 60 * 24);
  } else {
    // If never practiced, assume max decay
    daysSinceLastPractice = 60;
  }

  const retentionFactor = Math.max(0.3, 1.0 - (daysSinceLastPractice * 0.015)) * 100;

  let mastery = 0;
  
  if (skillState.assessmentResults && skillState.assessmentResults.length > 0) {
    // For the prototype, we use assessment results as the primary driver
    const avgAss = skillState.assessmentResults.reduce((a, b) => a + b, 0) / skillState.assessmentResults.length;
    mastery = (avgAss * 0.85) + (retentionFactor * 0.15);
  } else {
    mastery = (assessmentScore * 0.4) + (practiceScore * 0.3) + (conceptScore * 0.15) + (retentionFactor * 0.15);
  }

  return Math.round(Math.max(0, Math.min(100, mastery)));
};

export const determineEvidenceLevel = (assessmentResults = []) => {
  if (assessmentResults.length === 0) return 'none';
  if (assessmentResults.length <= 1) return 'weak';
  if (assessmentResults.length <= 3) return 'medium';
  return 'strong';
};

export const determineSkillStatus = (mastery, evidenceLevel, threshold, confidenceScore = 0, lastPracticedAt) => {
  if (evidenceLevel === 'none') return 'unverified';
  
  if (mastery >= threshold && ['medium', 'strong', 'weak'].includes(evidenceLevel)) {
    // Check if refresh needed
    if (lastPracticedAt) {
      const daysSinceLastPractice = (Date.now() - new Date(lastPracticedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPractice > 30) return 'refreshNeeded';
    }
    return 'verified';
  }

  if (mastery < threshold && confidenceScore > (mastery + 15)) {
    return 'overconfident';
  }

  if (mastery < threshold) {
    return 'gap';
  }

  return 'unverified';
};
