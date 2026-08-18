import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Mentor: Get list of students for course assignment
export const getMentorStudents = async () => {
  const response = await api.get(API_ENDPOINTS.MENTOR_STUDENTS);
  return response.data;
};

// Mentor: Get students with enrollment status for a specific course
export const getStudentsForCourse = async (courseId) => {
  const response = await api.get(API_ENDPOINTS.MENTOR_STUDENTS_FOR_COURSE(courseId));
  return response.data;
};

// Get all courses assigned to the student
export const getMyCourses = async () => {
  const response = await api.get(API_ENDPOINTS.MY_COURSES);
  return response.data;
};

// Mentor: Get courses created by mentor
export const getMentorCourses = async () => {
  const response = await api.get(API_ENDPOINTS.MY_COURSES);
  return response.data;
};

// Get course by ID
export const getCourseById = async (courseId) => {
  const response = await api.get(API_ENDPOINTS.COURSE_BY_ID(courseId));
  return response.data;
};

// Get chapters for a course
export const getCourseChapters = async (courseId) => {
  const response = await api.get(API_ENDPOINTS.CHAPTERS(courseId));
  return response.data;
};

// Mentor: Create new course
export const createCourse = async (courseData) => {
  const response = await api.post(API_ENDPOINTS.COURSES, courseData);
  return response.data;
};

// Mentor: Update course
export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(API_ENDPOINTS.COURSE_BY_ID(courseId), courseData);
  return response.data;
};

// Mentor: Delete course
export const deleteCourse = async (courseId) => {
  const response = await api.delete(API_ENDPOINTS.COURSE_BY_ID(courseId));
  return response.data;
};

// Mentor: Assign course to students
export const assignCourse = async (courseId, studentIds) => {
  const response = await api.post(API_ENDPOINTS.ASSIGN_COURSE(courseId), { 
    courseId,
    studentIds 
  });
  return response.data;
};

// Mentor: Get course analytics
export const getCourseAnalytics = async (courseId) => {
  const response = await api.get(`/api/courses/${courseId}/analytics`);
  return response.data;
};

// Mentor: Get student progress for a course
export const getCourseStudentProgress = async (courseId) => {
  const response = await api.get(`/api/courses/${courseId}/analytics/students`);
  return response.data;
};

// Mentor: Add chapter to course
export const addChapter = async (courseId, chapterData) => {
  const response = await api.post(API_ENDPOINTS.CHAPTERS(courseId), chapterData);
  return response.data;
};

// Mentor: Update chapter
export const updateChapter = async (courseId, chapterId, chapterData) => {
  const response = await api.put(API_ENDPOINTS.CHAPTER_BY_ID(courseId, chapterId), chapterData);
  return response.data;
};

// Mentor: Delete chapter
export const deleteChapter = async (courseId, chapterId) => {
  const response = await api.delete(API_ENDPOINTS.CHAPTER_BY_ID(courseId, chapterId));
  return response.data;
};
