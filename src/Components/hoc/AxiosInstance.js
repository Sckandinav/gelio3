// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { url } from '../../routes/routes';

// export const useAxiosInstance = () => {
//   const navigate = useNavigate();

//   const axiosInstance = axios.create({
//     baseURL: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_API_URL + '/api' : process.env.REACT_APP_PROD_API_URL + '/api',
//     timeout: 10000,
//   });

//   axiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//       if (error.response) {
//         const { status } = error.response;

//         if (status === 401) {
//           navigate(url.login());
//         } else if (status >= 500) {
//           navigate(url.error());
//         }
//       }
//       return Promise.reject(error);
//     },
//   );

//   return axiosInstance;
// };
