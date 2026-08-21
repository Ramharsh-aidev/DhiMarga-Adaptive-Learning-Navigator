import api from './api';

/**
 * Fetch the student's navigator state from the backend.
 * Returns { stateJson, updatedAt } or null if not found.
 */
export const getNavigatorState = async () => {
  const response = await api.get('/api/navigator/state');
  return response.data;
};

/**
 * Save the student's navigator state to the backend.
 * Accepts the raw state object (will be stringified here).
 */
export const saveNavigatorState = async (stateObject) => {
  const response = await api.put('/api/navigator/state', {
    stateJson: JSON.stringify(stateObject)
  });
  return response.data;
};
