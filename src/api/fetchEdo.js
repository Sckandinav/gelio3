import { axiosInstance } from '../Components/hoc/AxiosInstance';
export const FetchEdo = async url => {
  try {
    const token = localStorage.getItem('token');
    const axInst = axiosInstance;

    const response = await axInst.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('FetchEdo Error:', error);
    throw error;
  }
};
