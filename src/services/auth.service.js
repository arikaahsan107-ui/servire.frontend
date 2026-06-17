import API from './api';

export const register = async (userData) => {
  try {
    // ✅ SAHI: /api/auth/register
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return { success: false, message: 'Network error. Please try again.' };
    } else {
      return { success: false, message: error.message || 'Registration failed' };
    }
  }
};

export const login = async (email, password) => {
  try {
    // ✅ SAHI: /api/auth/login
    const response = await API.post('/api/auth/login', { email, password });
    if (response.data.success) {
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return { success: false, message: 'Network error. Please try again.' };
    } else {
      return { success: false, message: error.message || 'Login failed' };
    }
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // ✅ SAHI: /api/auth/logout
  try {
    API.post('/api/auth/logout');
  } catch (error) {
    // Ignore errors on logout
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const updateUser = (userData) => {
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};