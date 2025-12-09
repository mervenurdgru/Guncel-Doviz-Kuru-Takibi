import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.10.2:5142/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (username, password) => api.post('/Auth/login', { username, password });
export const register = (username, email, password) => api.post('/Auth/register', { 
    username: username, 
    email: email, 
    password: password 
});
export const getLatestRates = () => api.get('/Currency/latest');
export const getWeeklyHistory = (code) => api.get(`/Currency/history/weekly/${code}`);   
export const getMonthlyHistory = (code) => api.get(`/Currency/history/monthly/${code}`); 


export const getFavorites = () => api.get('/Favorites');
export const addFavorite = (code) => api.post('/Favorites', { currencyCode: code });
export const removeFavorite = (code) => api.delete(`/Favorites/${code}`);

export const getWallet = () => api.get('/Wallet');
export const addToWallet = (code, amount) => api.post('/Wallet', { 
    currencyCode: code, 
    amount: parseFloat(amount) 
});
export const removeFromWallet = (code) => api.delete(`/Wallet/${code}`);

export default api;