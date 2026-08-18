import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextProvider';
import { STORAGE_KEYS } from '../utils/constants';
import { login as loginService, register as registerService, isTokenExpired } from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      console.log('CheckAuth - storedToken:', storedToken);
      console.log('CheckAuth - storedUser:', storedUser);

      if (storedToken && storedUser && !isTokenExpired(storedToken)) {
        const parsedUser = JSON.parse(storedUser);
        console.log('CheckAuth - parsed user:', parsedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginService(credentials);
      
      // Debug: Log the response data
      console.log('Login response data:', data);
      
      // Store token and user data - backend returns nested user object
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      const userToStore = {
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        approvalStatus: data.user.approvalStatus,
      };
      
      console.log('Storing user data:', userToStore);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));

      setToken(data.token);
      setUser(userToStore);
      setIsAuthenticated(true);

      return { success: true, user: userToStore };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerService(userData);
      
      console.log('Registration response:', data);
      
      // Check if token exists (STUDENT/ADMIN) or if it's a pending mentor (no token)
      const userToStore = {
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        isApproved: data.user.isApproved,
      };
      
      // If mentor is pending approval (no token), don't auto-login
      if (!data.token && data.user.role === 'MENTOR' && !data.user.isApproved) {
        console.log('Mentor registration pending approval - no token provided');
        return { 
          success: true, 
          pendingApproval: true,
          user: userToStore
        };
      }
      
      // For STUDENT/ADMIN or approved mentors, auto-login
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));

      setToken(data.token);
      setUser(userToStore);
      setIsAuthenticated(true);

      return { success: true, pendingApproval: false };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
