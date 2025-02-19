import { applicationUrl } from '../../routes/routes';

export const fetchApprove = async (id, axiosInstance) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axiosInstance.post(
      applicationUrl.approve(id),
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return 'ok';
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
