import axios from 'axios';

export const baseURL = 'https://relicario-api.josematias.dev';

const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error?.response?.status === 403) {
      localStorage.removeItem('Auth@token');
      localStorage.removeItem('Auth@user');
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default api;
