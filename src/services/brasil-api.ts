import axios from 'axios';

export const baseURL = 'https://brasilapi.com.br/api/cep/v2';

const brasilApi = axios.create({
  baseURL,
  method: 'GET',
});

export default brasilApi;
