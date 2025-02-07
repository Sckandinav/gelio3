export const fetchApplicationMenu = async (url, axiosInstance) => {
  try {
    const token = localStorage.getItem('token');

    const res = await axiosInstance.get(url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
    });

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
