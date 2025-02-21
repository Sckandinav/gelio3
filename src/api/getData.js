export const getData = async (url, axiosInstance, params) => {
  const token = localStorage.getItem('token');
  try {
    const res = await axiosInstance.get(url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      params,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
