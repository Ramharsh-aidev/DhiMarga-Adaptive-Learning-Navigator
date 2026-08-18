// API Base URL - Use environment variable with fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  
  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_USER_BY_ID: (userId) => `/api/admin/users/${userId}`,
  APPROVE_MENTOR: (userId) => `/api/admin/users/${userId}/approve-mentor`,
  
  // Mentor
  MENTOR_STUDENTS: '/api/mentor/students',
  MENTOR_STUDENTS_FOR_COURSE: (courseId) => `/api/mentor/students/for-course/${courseId}`,
  
  // Courses
  COURSES: '/api/courses',
  MY_COURSES: '/api/courses/my',
  COURSE_BY_ID: (courseId) => `/api/courses/${courseId}`,
  ASSIGN_COURSE: (courseId) => `/api/courses/${courseId}/assign`,
  
  // Chapters
  CHAPTERS: (courseId) => `/api/courses/${courseId}/chapters`,
  CHAPTER_BY_ID: (courseId, chapterId) => `/api/courses/${courseId}/chapters/${chapterId}`,
  
  // Progress
  MY_PROGRESS: '/api/progress/my',
  COURSE_PROGRESS: (courseId) => `/api/progress/courses/${courseId}`,
  COMPLETE_CHAPTER: (chapterId) => `/api/progress/chapters/${chapterId}/complete`,
  
  // Certificates
  CERTIFICATES: '/api/certificates/my',
  CERTIFICATE_BY_ID: (certificateId) => `/api/certificates/${certificateId}`,
  GENERATE_CERTIFICATE: (courseId) => `/api/certificates/courses/${courseId}/generate`,
  DOWNLOAD_CERTIFICATE: (certificateId) => `/api/certificates/${certificateId}/download`,
  VERIFY_CERTIFICATE: (code) => `/api/certificates/verify/${code}`,
  
  // Profile
  PROFILE: '/api/users/profile',
  CHANGE_PASSWORD: '/api/users/change-password',
  UPLOAD_PROFILE_PICTURE: '/api/users/profile-picture',
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'lms_token',
  USER: 'lms_user',
  NAVIGATOR: 'lms_navigator',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
