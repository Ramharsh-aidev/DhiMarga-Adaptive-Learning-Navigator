import api from './api';

export const getLeaderboard = async (page = 0, size = 10) => {
  const res = await api.get(`/api/social/leaderboard?page=${page}&size=${size}`);
  return res.data;
};

export const getRecommendedMentors = async () => {
  const res = await api.get('/api/social/mentors/recommended');
  return res.data;
};

export const getChallenges = async () => {
  const res = await api.get('/api/social/challenges');
  return res.data;
};

export const getSquads = async () => {
  const res = await api.get('/api/social/squads');
  return res.data;
};
