export const getRoom = async (url, axiosInstance) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('FetchRoom Error:', error);
    throw error;
  }
};
