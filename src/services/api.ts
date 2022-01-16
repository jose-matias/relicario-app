import axios from 'axios';

export const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://relicario-api.josematias.dev'
    : 'http://localhost:3700';

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
