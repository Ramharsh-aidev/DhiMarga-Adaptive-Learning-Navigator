import React, { useEffect, useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function DashboardTour({ run, setRun }) {
  const [steps] = useState([
    {
      target: '.tour-welcome',
      content: 'Welcome to your DhiMārga dashboard! This is your central hub for learning.',
      disableBeacon: true,
    },
    {
      target: '.tour-streak',
      content: 'This is your daily streak! Log in every day to keep the flame burning.',
    },
    {
      target: '.tour-navigator',
      content: 'Your AI Learning Navigator. It automatically adapts your curriculum based on your progress.',
    },
    {
      target: '.tour-health',
      content: 'Monitor your Path Health here. The AI will intervene if you get stuck.',
    },
    {
      target: '.tour-leaderboard',
      content: 'See where you stand globally! Earn XP to climb the ranks.',
    }
  ]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('dhimarga_tour_completed', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#7c3aed', // violet-600
          zIndex: 1000,
        },
      }}
    />
  );
}
