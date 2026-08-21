import { openSourceResources } from './openSourceResources';

export const getResourcesForSkill = (skillId, contentMode = 'mentor') => {
  // If open source mode, look up in the open source registry
  if (contentMode === 'opensource') {
    const osRes = openSourceResources.ml_engineer.filter(r => r.skillIds.includes(skillId));
    if (osRes.length > 0) {
      return osRes.map((r, idx) => ({
        id: `os_${skillId}_${idx}`,
        title: r.title,
        type: r.type,
        durationMinutes: r.durationMinutes,
        difficulty: 'intermediate', // default
        skillsCovered: r.skillIds,
        learningStyle: 'video', // mostly video/course
        url: r.url
      }));
    }
  }

  // Mentor mode (or fallback if no open source resource explicitly defined)
  // Hardcoded resources for the critical path to show specific demo functionality
  const specificResources = {
    'probability': [
      {
        id: 'res_prob_1',
        title: 'Conditional Probability Crash Course (Mentor Led)',
        type: 'micro-module',
        durationMinutes: 45,
        difficulty: 'intermediate',
        skillsCovered: ['probability'],
        learningStyle: 'interactive'
      },
      {
        id: 'res_prob_2',
        title: 'Probability Foundations Full Course (Mentor Led)',
        type: 'course',
        durationMinutes: 180,
        difficulty: 'beginner',
        skillsCovered: ['probability', 'statistics_basics'],
        learningStyle: 'video'
      },
      {
        id: 'res_prob_3',
        title: 'Probability Practice Set (Mentor Led)',
        type: 'practice',
        durationMinutes: 30,
        difficulty: 'intermediate',
        skillsCovered: ['probability'],
        learningStyle: 'interactive'
      }
    ],
    'regression': [
      {
        id: 'res_reg_1',
        title: 'Intro to Linear Regression (Mentor Led)',
        type: 'micro-module',
        durationMinutes: 60,
        difficulty: 'intermediate',
        skillsCovered: ['regression'],
        learningStyle: 'interactive'
      },
      {
        id: 'res_reg_2',
        title: 'Regression with scikit-learn (Mentor Led)',
        type: 'project',
        durationMinutes: 120,
        difficulty: 'intermediate',
        skillsCovered: ['regression'],
        learningStyle: 'project'
      }
    ],
    'model_evaluation': [
      {
        id: 'res_eval_1',
        title: 'Evaluating ML Models (Mentor Led)',
        type: 'course',
        durationMinutes: 90,
        difficulty: 'intermediate',
        skillsCovered: ['model_evaluation'],
        learningStyle: 'video'
      }
    ]
  };

  if (specificResources[skillId]) {
    return specificResources[skillId];
  }

  // Fallback: Generate sensible default resources for any other skill
  const formattedTitle = skillId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return [
    {
      id: `res_${skillId}_1`,
      title: `${formattedTitle} Fundamentals (Mentor Led)`,
      type: 'course',
      durationMinutes: 120,
      difficulty: 'beginner',
      skillsCovered: [skillId],
      learningStyle: 'video'
    },
    {
      id: `res_${skillId}_2`,
      title: `Applied ${formattedTitle} (Mentor Led)`,
      type: 'micro-module',
      durationMinutes: 45,
      difficulty: 'intermediate',
      skillsCovered: [skillId],
      learningStyle: 'interactive'
    }
  ];
};
