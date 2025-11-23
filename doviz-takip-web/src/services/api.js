import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5142/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (username, password) => api.post('/Auth/login', { username, password });
export const register = (username, password) => api.post('/Auth/register', { username, password });
export const getLatestRates = () => api.get('/Currency/latest');
export const getCurrencyHistory = (code) => api.get(`/Currency/history/${code}`);
export const getFavorites = () => api.get('/Favorites');
export const addFavorite = (code) => api.post('/Favorites', { currencyCode: code });
export const removeFavorite = (code) => api.delete(`/Favorites/${code}`);

export default api;