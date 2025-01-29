import axios from 'axios';
import { url } from '../../routes/routes';

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_API_URL + '/api' : process.env.REACT_APP_PROD_API_URL + '/api',
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        window.location.href = url.login();
      } else if (status >= 500) {
        window.location.href = url.error();
      }
    }
    return Promise.reject(error);
  },
);
