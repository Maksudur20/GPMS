import api from './client.js';

// Auth APIs
export const registerAdmin = (username, email, password) => {
  return api.post('/auth/register', { username, email, password });
};

export const loginAdmin = (username, password) => {
  return api.post('/auth/login', { username, password });
};

// Order APIs
export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const getOrders = () => {
  return api.get('/orders');
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const updateOrder = (id, orderData) => {
  return api.put(`/orders/${id}`, orderData);
};

export const deleteOrder = (id) => {
  return api.delete(`/orders/${id}`);
};

// Dashboard APIs
export const getDashboardStats = () => {
  return api.get('/dashboard/stats');
};

export const getAnalytics = () => {
  return api.get('/dashboard/analytics');
};

// Settings APIs
export const getSettings = () => {
  return api.get('/settings');
};

export const updateSettings = (settingsData) => {
  return api.put('/settings', settingsData);
};
