
import API from './api';

export const register = async (userData) => {
  try {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    if (error.response) return error.response.data;
    if (error.request) return { success: false, message: 'Network error' };
    return { success: false, message: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const response = await API.post('/api/auth/login', { email, password });
    if (response.data.success) {
      if (response.data.accessToken) localStorage.setItem('accessToken', response.data.accessToken);
      if (response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);
      if (response.data.user) localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    if (error.response) return error.response.data;
    if (error.request) return { success: false, message: 'Network error' };
    return { success: false, message: error.message };
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  try {
    API.post('/api/auth/logout');
  } catch (error) {}
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
};

export const isAuthenticated = () => !!localStorage.getItem('accessToken');
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const updateUser = (userData) => {
  if (userData) localStorage.setItem('user', JSON.stringify(userData));
};