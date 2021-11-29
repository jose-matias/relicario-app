import axios from 'axios';

// https://relicario-api.josmatias.dev
// export const baseURL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://lmr.com'
//     : 'https://sandbox.plantebemtec.com.br';

export const baseURL = 'http://localhost:2021';

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
