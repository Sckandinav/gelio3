export const fetchUsers = async (url, axiosInstance) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('FetchUsers Error:', error);
    throw error;
  }
};
