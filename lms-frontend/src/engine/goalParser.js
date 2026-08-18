/**
 * Fallback Goal Parser (Deterministic Keyword-based)
 * Used when AI is unavailable.
 */
import { capabilityGraphs } from '../data/capabilityGraphs';

export const parseGoalFallback = (inputText) => {
  const text = inputText.toLowerCase();
  
  let targetRole = 'ml_engineer';
  if (text.includes('data analyst') || text.includes('analytics')) targetRole = 'data_analyst';
  if (text.includes('full stack') || text.includes('web')) targetRole = 'fullstack_dev';
  if (text.includes('cloud') || text.includes('devops')) targetRole = 'cloud_engineer';

  const graph = capabilityGraphs[targetRole];
  
  let deadline = '12 weeks';
  const weekMatch = text.match(/(\d+)\s*weeks?/);
  if (weekMatch) deadline = `${weekMatch[1]} weeks`;

  let availableHoursPerWeek = 10;
  const hourMatch = text.match(/(\d+)\s*hours?/);
  if (hourMatch) availableHoursPerWeek = parseInt(hourMatch[1], 10);

  const totalBudgetHours = parseInt(deadline) * availableHoursPerWeek;

  const knownSkills = [];
  const suspectedGaps = [];
  
  // Very crude keyword matching for known skills
  const skillsToLookFor = ['python', 'sql', 'statistics', 'react', 'javascript', 'linux', 'docker'];
  for (const skill of skillsToLookFor) {
    if (text.includes(skill)) {
      // Crude logic: if text contains "weak at X" or "struggle with X"
      if (text.includes(`weak at ${skill}`) || text.includes(`don't know ${skill}`)) {
        suspectedGaps.push(skill);
      } else {
        knownSkills.push(skill);
      }
    }
  }

  let learningPreference = 'video';
  if (text.includes('project') || text.includes('hands-on')) learningPreference = 'project-based';
  if (text.includes('interactive') || text.includes('practice')) learningPreference = 'interactive';
  if (text.includes('read')) learningPreference = 'reading';

  return {
    targetRole,
    deadline,
    availableHoursPerWeek,
    totalBudgetHours,
    knownSkills,
    suspectedGaps,
    experience: 'beginner',
    learningPreference,
    specialization: null
  };
};
