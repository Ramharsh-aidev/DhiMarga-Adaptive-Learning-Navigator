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
      dispatch({ type: 'ADD_SKILL_TO_PATH', payload: payload.skillId });
      break;

    case 'ADD_SUBTREE':
      // payload: { topic, nodes: [{id, label, category, estimatedHours, prerequisites, unlocks}] }
      dispatch({ type: 'ADD_SUBTREE_TO_PATH', payload: payload });
      break;
      
    case 'REMOVE_SKILL':
      dispatch({ type: 'REMOVE_SKILL_FROM_PATH', payload: payload.skillId });
      break;

    case 'CONFIGURE_SKILL':
      // payload: { skillId, estimatedHours }
      dispatch({ type: 'CONFIGURE_SKILL_IN_PATH', payload });
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
