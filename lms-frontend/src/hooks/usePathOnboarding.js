import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigator } from '../context/NavigatorContext';
import { aiService } from '../services/aiService';
import { getGraph } from '../services/navigatorService';

export const usePathOnboarding = () => {
  const { dispatch, state } = useNavigator();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const startOnboarding = async (input) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      let goal;
      if (typeof input === 'string') {
        if (!input.trim()) {
           setIsProcessing(false);
           return;
        }
        // 1. Parse goal and extract any custom topics the user requested
        goal = await aiService.parseGoal(input);
      } else {
        goal = input; // Directly accept the pre-analyzed payload
        
        // If there's custom context, extract known skills using the graph template
        if (goal.customContext) {
          try {
            const graph = await getGraph(goal.targetRole);
            if (graph && graph.nodes) {
              const knownSkills = await aiService.extractKnownSkills(goal.customContext, graph.nodes);
              goal.knownSkills = knownSkills;
            }
          } catch (err) {
            console.error("Failed to extract known skills", err);
          }
        }
      }
      
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
