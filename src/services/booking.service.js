import API from './api';

export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await API.get('/users/bookings');
  return response.data;
};

export const cancelBooking = async (bookingId, reason) => {
  const response = await API.put(`/bookings/${bookingId}/cancel`, { reason });
  return response.data;
};