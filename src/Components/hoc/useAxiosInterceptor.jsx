import axios from 'axios';
import { url } from '../../routes/routes';
import { useNavigate } from 'react-router-dom';

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(
    config => {
      console.log('Запрос отправлен:', config.url);
      return config;
    },
    error => {
      console.error('Ошибка при отправке запроса:', error);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      console.log('Ответ получен:', response.config.url);
      return response;
    },
    error => {
      console.error('Ошибка при получении ответа:', error);
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
        } else if (status === 409) {
          return Promise.reject(error);
        } else {
          navigate(url.error());
        }
      } else {
        console.error('Ошибка без ответа от сервера:', error);
        navigate(url.error());
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
