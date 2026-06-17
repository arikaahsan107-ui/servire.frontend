import API from './api';

export const register = async (userData) => {
  try {
    // ✅ FIXED: /register (not /auth/register)
    const response = await API.post('/register', userData);
    return response.data;
  } catch (error) {
    // Handle error properly
    if (error.response) {
      // Server responded with error
      return error.response.data;
    } else if (error.request) {
      // Request made but no response
      return { success: false, message: 'Network error. Please try again.' };
    } else {
      // Something else happened
      return { success: false, message: error.message || 'Registration failed' };
    }
  }
};

export const login = async (email, password) => {
  try {
    // ✅ FIXED: /login (not /auth/login)
    const response = await API.post('/login', { email, password });
    if (response.data.success) {
      // Store tokens and user data
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
    // Handle error properly
    if (error.response) {
      // Server responded with error
      return error.response.data;
    } else if (error.request) {
      // Request made but no response
      return { success: false, message: 'Network error. Please try again.' };
    } else {
      // Something else happened
      return { success: false, message: error.message || 'Login failed' };
    }
  }
};

export const logout = () => {
  // Clear all stored data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // ✅ FIXED: /logout (not /auth/logout)
  try {
    API.post('/logout');
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

// Helper function to update user data in localStorage
export const updateUser = (userData) => {
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};