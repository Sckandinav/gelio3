import { axiosInstance } from '../Components/hoc/AxiosInstance';

export const getRooms = async (url, params) => {
  try {
    const token = localStorage.getItem('token');
    const axios = axiosInstance;

    const res = await axios.get(url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      params,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
