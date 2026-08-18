import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get current user profile
export const getProfile = async () => {
  const response = await api.get(API_ENDPOINTS.PROFILE);
  return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.put(API_ENDPOINTS.PROFILE, profileData);
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.put(API_ENDPOINTS.CHANGE_PASSWORD, passwordData);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(API_ENDPOINTS.UPLOAD_PROFILE_PICTURE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete account (optional - for future)
export const deleteAccount = async () => {
  const response = await api.delete(API_ENDPOINTS.PROFILE);
  return response.data;
};
