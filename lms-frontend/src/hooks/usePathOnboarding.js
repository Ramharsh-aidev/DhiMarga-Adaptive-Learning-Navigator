import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigator } from '../context/NavigatorContext';
import { aiService } from '../services/aiService';

export const usePathOnboarding = () => {
  const { dispatch, state } = useNavigator();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const startOnboarding = async (input) => {
    if (!input.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Parse goal and extract any custom topics the user requested
      const goal = await aiService.parseGoal(input);
      
      // 2. Dispatch to context (this creates the base path in the database and sets it active)
      await dispatch({ type: 'SET_GOAL', payload: { ...goal, forceNew: true } });
      
      // 3. Prepare the welcome message
      let welcomeMsg = `Great! I've built a base capability graph for a ${goal.targetRole.replace('_', ' ')}. Let's review your personalized learning path.`;
      
      if (goal.customTopics && goal.customTopics.length > 0) {
        welcomeMsg = `Great! I've built a base capability graph for a ${goal.targetRole.replace('_', ' ')}. I also noticed you requested specific topics: ${goal.customTopics.join(', ')}. I'm drafting those custom additions into your path now!`;
      }

      await dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'assistant',
          content: welcomeMsg
        }
      });
      
      // 4. Navigate to canvas plan right away so the user isn't stuck waiting
      navigate('/student/navigator/plan', { state: { newPath: true, customTopics: goal.customTopics } });

    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return { startOnboarding, isProcessing };
};
