export const getQuestionsForSkill = (skillId) => {
  // Hardcoded questions for the demo path
  const specificQuestions = {
    'probability': [
      {
        id: 'q_prob_1',
        question: 'What is P(A|B) if P(A∩B)=0.3 and P(B)=0.5?',
        options: ['0.15', '0.6', '0.8', '0.35'],
        correctAnswer: '0.6',
        difficulty: 'easy'
      },
      {
        id: 'q_prob_2',
        question: 'Events A and B are independent. P(A)=0.4, P(B)=0.3. What is P(A∪B)?',
        options: ['0.12', '0.70', '0.58', '0.42'],
        correctAnswer: '0.58',
        difficulty: 'medium'
      },
      {
        id: 'q_prob_3',
        question: 'A bag has 3 red and 2 blue marbles. Two are drawn without replacement. What is the probability both are red?',
        options: ['3/10', '9/25', '6/25', '1/2'],
        correctAnswer: '3/10',
        difficulty: 'medium'
      }
    ],
    'statistics_basics': [
      {
        id: 'q_stat_1',
        question: 'Which measure of central tendency is most affected by outliers?',
        options: ['Mean', 'Median', 'Mode', 'Range'],
        correctAnswer: 'Mean',
        difficulty: 'easy'
      },
      {
        id: 'q_stat_2',
        question: 'What percentage of data falls within one standard deviation of the mean in a normal distribution?',
        options: ['50%', '68%', '95%', '99.7%'],
        correctAnswer: '68%',
        difficulty: 'easy'
      }
    ]
  };

  if (specificQuestions[skillId]) {
    return specificQuestions[skillId];
  }

  // Fallback: Generate dummy questions for other skills
  const formattedTitle = skillId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return [
    {
      id: `q_${skillId}_1`,
      question: `What is the primary purpose of ${formattedTitle}?`,
      options: ['To increase complexity', 'To solve specific domain problems', 'To reduce performance', 'None of the above'],
      correctAnswer: 'To solve specific domain problems',
      difficulty: 'easy'
    },
    {
      id: `q_${skillId}_2`,
      question: `Which of the following is a key concept in ${formattedTitle}?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'All of the above'],
      correctAnswer: 'All of the above',
      difficulty: 'medium'
    }
  ];
};
