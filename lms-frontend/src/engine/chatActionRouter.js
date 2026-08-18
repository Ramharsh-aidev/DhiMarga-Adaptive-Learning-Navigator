/**
 * Chat Action Router
 * Translates AI intents into state updates.
 */

export const routeChatAction = (intent, payload, currentState, dispatch) => {
  console.log('Routing action:', intent, payload);
  
  switch (intent) {
    case 'SET_GOAL':
      dispatch({ type: 'SET_GOAL', payload: payload });
      break;
    
    case 'ADD_SKILL':
      // payload: { skillId }
      dispatch({ type: 'ADD_SKILL_TO_PATH', payload: payload.skillId });
      break;
      
    case 'REMOVE_SKILL':
      // payload: { skillId }
      dispatch({ type: 'REMOVE_SKILL_FROM_PATH', payload: payload.skillId });
      break;
      
    case 'UPDATE_CONSTRAINT':
      // payload: { field, value } e.g., deadline, hours
      dispatch({ type: 'UPDATE_CONSTRAINT', payload });
      break;
      
    case 'TRIGGER_RECOVERY':
      // payload: { skillId }
      dispatch({ type: 'TRIGGER_RECOVERY', payload: payload.skillId });
      break;
      
    case 'START_JOURNEY':
      dispatch({ type: 'SET_PATH_STATUS', payload: 'active' });
      break;
      
    case 'REPLAN':
      dispatch({ type: 'REPLAN_PATH' });
      break;
      
    default:
      console.warn(`Unknown intent: ${intent}`);
  }
};
