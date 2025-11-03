import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const salaryTypeAPI = {
  getAll: () => api.get('/salary-types'),
  create: (data) => api.post('/salary-types', data),
  update: (id, data) => api.put(`/salary-types/${id}`, data),
  delete: (id) => api.delete(`/salary-types/${id}`),
};

export const workSessionAPI = {
  getByMonth: (year, month) => api.get('/work-sessions', { params: { year, month } }),
  getByDateRange: (startDate, endDate) => 
    api.get('/work-sessions', { params: { startDate, endDate } }),
  create: (data) => api.post('/work-sessions', data),
  update: (id, data) => api.put(`/work-sessions/${id}`, data),
  delete: (id) => api.delete(`/work-sessions/${id}`),
  getSummary: (startDate, endDate) => 
    api.get('/work-sessions/summary', { params: { startDate, endDate } }),
};

export default api;
