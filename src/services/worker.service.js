import API from './api';

export const getWorkers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.skill) params.append('skill', filters.skill);
  if (filters.city) params.append('city', filters.city);
  if (filters.minRating) params.append('minRating', filters.minRating);
  if (filters.verified) params.append('verified', filters.verified);
  if (filters.availability) params.append('availability', filters.availability);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const response = await API.get(`/workers?${params.toString()}`);
  return response.data;
};

export const getWorkerById = async (id) => {
  const response = await API.get(`/workers/${id}`);
  return response.data;
};