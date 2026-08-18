import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get all users (Admin only) with optional filters
export const getAllUsers = async (filters = {}) => {
  const params = {};
  if (filters.role) params.role = filters.role;
  if (filters.approvalStatus !== undefined) {
    params.approved = filters.approvalStatus === 'APPROVED';
  }
  
  const response = await api.get(API_ENDPOINTS.ADMIN_USERS, { params });
  return response.data;
};

// Get user by ID (Admin only)
export const getUserById = async (userId) => {
  const response = await api.get(API_ENDPOINTS.ADMIN_USER_BY_ID(userId));
  return response.data;
};

// Approve mentor (Admin only)
export const approveMentor = async (userId) => {
  const response = await api.put(API_ENDPOINTS.APPROVE_MENTOR(userId));
  return response.data;
};
