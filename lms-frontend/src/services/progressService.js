import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get all progress for current student
export const getMyProgress = async () => {
  const response = await api.get(API_ENDPOINTS.MY_PROGRESS);
  return response.data;
};

// Get detailed progress for a specific course
export const getCourseProgress = async (courseId) => {
  const response = await api.get(API_ENDPOINTS.COURSE_PROGRESS(courseId));
  return response.data;
};

// Mark chapter as complete
export const completeChapter = async (chapterId) => {
  const response = await api.post(API_ENDPOINTS.COMPLETE_CHAPTER(chapterId));
  return response.data;
};

// Track time spent on a chapter
export const trackChapterTime = async (chapterId, timeSpentSeconds) => {
  const response = await api.post(`/api/progress/track-time/${chapterId}?timeSpentSeconds=${timeSpentSeconds}`);
  return response.data;
};
