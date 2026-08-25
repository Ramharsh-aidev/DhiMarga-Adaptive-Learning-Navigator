import api from './api';

// --- Graph Templates (Read Only) ---
export const getAvailableGraphs = async () => {
  const res = await api.get('/api/navigator/graphs');
  return res.data;
};

export const getGraph = async (slug) => {
  const res = await api.get(`/api/navigator/graphs/${slug}`);
  return res.data;
};

// --- User Paths CRUD ---
export const getUserPaths = async () => {
  const res = await api.get('/api/navigator/paths');
  return res.data;
};

export const createPath = async (data) => {
  const res = await api.post('/api/navigator/paths', data);
  return res.data;
};

export const getPathDetail = async (pathId) => {
  const res = await api.get(`/api/navigator/paths/${pathId}`);
  return res.data;
};

export const updatePath = async (pathId, data) => {
  const res = await api.put(`/api/navigator/paths/${pathId}`, data);
  return res.data;
};

export const deletePath = async (pathId) => {
  const res = await api.delete(`/api/navigator/paths/${pathId}`);
  return res.data;
};

export const updatePathStatus = async (pathId, data) => {
  const res = await api.put(`/api/navigator/paths/${pathId}/status`, data);
  return res.data;
};

export const updateContentMode = async (pathId, contentMode) => {
  const res = await api.put(`/api/navigator/paths/${pathId}/content-mode`, { contentMode });
  return res.data;
};

// --- Node Mastery & Personalization ---
export const updateNodeMastery = async (pathId, skillId, data) => {
  const res = await api.put(`/api/navigator/paths/${pathId}/nodes/${skillId}`, data);
  return res.data;
};

export const addPersonalizationNode = async (pathId, data) => {
  const res = await api.post(`/api/navigator/paths/${pathId}/nodes`, data);
  return res.data;
};

export const batchUpdateNodes = async (pathId, nodes) => {
  const res = await api.put(`/api/navigator/paths/${pathId}/nodes/batch`, { nodes });
  return res.data;
};

// --- Milestones ---
export const addMilestone = async (pathId, data) => {
  const res = await api.post(`/api/navigator/paths/${pathId}/milestones`, data);
  return res.data;
};

export const toggleMilestone = async (pathId, milestoneId) => {
  const res = await api.put(`/api/navigator/paths/${pathId}/milestones/${milestoneId}/toggle`);
  return res.data;
};

// --- Dashboard Summary (Optimized) ---
export const getDashboardSummary = async () => {
  const res = await api.get('/api/navigator/dashboard-summary');
  return res.data;
};

// --- Legacy UI State Blob (For Chat & Canvas Only) ---
export const getUiState = async () => {
  const res = await api.get('/api/navigator/state');
  return res.data;
};

export const saveUiState = async (uiState) => {
  const res = await api.put('/api/navigator/state', {
    stateJson: JSON.stringify(uiState)
  });
  return res.data;
};
