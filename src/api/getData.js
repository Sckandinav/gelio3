export const getData = async (url, axiosInstance) => {
  const token = localStorage.getItem('token');
  try {
    const res = await axiosInstance.get(url, { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
