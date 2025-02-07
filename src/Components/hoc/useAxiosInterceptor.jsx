import axios from 'axios';
import { url } from '../../routes/routes';
import { useNavigate } from 'react-router-dom';

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    // baseURL: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_API_URL + '/api' : process.env.REACT_APP_PROD_API_URL + '/api',
    // timeout: 5000,
  });

  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (axios.isCancel(error)) {
        console.log('Запрос был отменен', error.message);
        navigate(url.error());
        return Promise.reject(error);
      }

      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          navigate(url.login());
        } else if (status === 404) {
          navigate(url.notFound());
        }
      } else {
        navigate(url.error());
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
