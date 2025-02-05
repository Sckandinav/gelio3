export const getRooms = async (url, axiosInstance, params) => {
  try {
    const token = localStorage.getItem('token');

    const res = await axiosInstance.get(url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      params,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
