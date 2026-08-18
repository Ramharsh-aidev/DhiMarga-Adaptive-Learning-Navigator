import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Register new user
export const register = async (userData) => {
  const response = await api.post(API_ENDPOINTS.REGISTER, userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

// Decode JWT token (without external library for now)
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
