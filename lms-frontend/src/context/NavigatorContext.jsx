import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

import { capabilityGraphs } from '../data/capabilityGraphs';
import { generatePath, replanPath } from '../engine/pathOptimizer';

const NavigatorContext = createContext();

export const useNavigator = () => {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error('useNavigator must be used within a NavigatorProvider');
  }
  return context;
};

export const NavigatorProvider = ({ children }) => {
  const [state, setState] = useState({
    goal: null,
    capabilityGraph: null,
    learnerState: {},
    currentPath: [],
    pathStatus: 'planning',
    recoveryHistory: [],
    chatHistory: [],
    canvasEdits: [],
  });

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NAVIGATOR);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse navigator state', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NAVIGATOR, JSON.stringify(state));
  }, [state]);

  const dispatch = (action) => {
    setState((prevState) => {
      let newState = { ...prevState };
      
      switch (action.type) {
        case 'SET_GOAL': {
          const goal = action.payload;
          newState.goal = goal;
          newState.capabilityGraph = capabilityGraphs[goal.targetRole];
          
          // Initialize learner state with known skills
          const newLearnerState = {};
          if (goal.knownSkills) {
            goal.knownSkills.forEach(skill => {
              newLearnerState[skill] = {
                skillId: skill,
                masteryScore: 100,
                evidenceLevel: 'strong',
                status: 'verified'
              };
            });
          }
          newState.learnerState = newLearnerState;
          
          // Generate initial path
          if (newState.capabilityGraph) {
            newState.currentPath = generatePath(goal, newLearnerState, newState.capabilityGraph);
          }
          newState.pathStatus = 'planning';
          newState.chatHistory = [];
          newState.recoveryHistory = [];
          break;
        }
        
        case 'ADD_CHAT_MESSAGE':
          newState.chatHistory = [...newState.chatHistory, action.payload];
          break;
          
        case 'SET_PATH_STATUS':
          newState.pathStatus = action.payload;
          break;
          
        case 'REPLAN_PATH':
          if (newState.capabilityGraph && newState.currentPath.length > 0) {
            newState.currentPath = replanPath(newState.currentPath, newState.learnerState, newState.capabilityGraph);
          }
          break;

        case 'UPDATE_CONSTRAINT': {
          if (newState.goal) {
            newState.goal = { ...newState.goal, [action.payload.field]: action.payload.value };
            // Recalculate budget if hours/deadline changed
            if (action.payload.field === 'deadline' || action.payload.field === 'availableHoursPerWeek') {
               const wks = parseInt(newState.goal.deadline) || 12;
               newState.goal.totalBudgetHours = wks * (newState.goal.availableHoursPerWeek || 10);
            }
            if (newState.capabilityGraph && newState.currentPath.length > 0) {
              newState.currentPath = replanPath(newState.currentPath, newState.learnerState, newState.capabilityGraph);
            }
          }
          break;
        }

        case 'ADD_SKILL_TO_PATH': {
          const skillId = action.payload;
          if (newState.capabilityGraph?.nodes[skillId] && !newState.currentPath.find(n => n.skillId === skillId)) {
            // For prototype, simply append to path and rely on replanPath to sort later if needed
            // A true implementation would use topological sort and validate
            newState.currentPath.push({
              skillId,
              order: newState.currentPath.length,
              status: 'upcoming',
              estimatedHours: 2,
              selectedResource: null,
              isUserAdded: true,
              isRecovery: false,
              nodeRef: newState.capabilityGraph.nodes[skillId]
            });
          }
          break;
        }

        case 'REMOVE_SKILL_FROM_PATH': {
          newState.currentPath = newState.currentPath.filter(n => n.skillId !== action.payload);
          break;
        }
        
        case 'UPDATE_MASTERY': {
          const { skillId, masteryScore } = action.payload;
          newState.learnerState = {
            ...newState.learnerState,
            [skillId]: {
              ...newState.learnerState[skillId],
              skillId,
              masteryScore,
              evidenceLevel: 'strong',
              status: masteryScore >= (newState.capabilityGraph.nodes[skillId]?.masteryThreshold || 60) ? 'verified' : 'gap'
            }
          };
          break;
        }
        
        case 'TRIGGER_RECOVERY': {
           newState.pathStatus = 'blocked';
           break;
        }
        
        case 'CLEAR_STATE':
           newState = {
              goal: null,
              capabilityGraph: null,
              learnerState: {},
              currentPath: [],
              pathStatus: 'planning',
              recoveryHistory: [],
              chatHistory: [],
              canvasEdits: [],
           };
           break;

        default:
          break;
      }
      return newState;
    });
  };

  return (
    <NavigatorContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigatorContext.Provider>
  );
};
