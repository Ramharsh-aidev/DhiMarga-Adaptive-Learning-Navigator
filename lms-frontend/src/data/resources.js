export const getResourcesForSkill = (skillId) => {
  // Hardcoded resources for the critical path to show specific demo functionality
  const specificResources = {
    'probability': [
      {
        id: 'res_prob_1',
        title: 'Conditional Probability Crash Course',
        type: 'micro-module',
        durationMinutes: 45,
        difficulty: 'intermediate',
        skillsCovered: ['probability'],
        learningStyle: 'interactive'
      },
      {
        id: 'res_prob_2',
        title: 'Probability Foundations Full Course',
        type: 'course',
        durationMinutes: 180,
        difficulty: 'beginner',
        skillsCovered: ['probability', 'statistics_basics'],
        learningStyle: 'video'
      },
      {
        id: 'res_prob_3',
        title: 'Probability Practice Set',
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
        title: 'Intro to Linear Regression',
        type: 'micro-module',
        durationMinutes: 60,
        difficulty: 'intermediate',
        skillsCovered: ['regression'],
        learningStyle: 'interactive'
      },
      {
        id: 'res_reg_2',
        title: 'Regression with scikit-learn',
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
        title: 'Evaluating ML Models',
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
      title: `${formattedTitle} Fundamentals`,
      type: 'course',
      durationMinutes: 120,
      difficulty: 'beginner',
      skillsCovered: [skillId],
      learningStyle: 'video'
    },
    {
      id: `res_${skillId}_2`,
      title: `Applied ${formattedTitle}`,
      type: 'micro-module',
      durationMinutes: 45,
      difficulty: 'intermediate',
      skillsCovered: [skillId],
      learningStyle: 'interactive'
    }
  ];
};
