import axios from 'axios';

export const getMainData = async (userId: string): Promise<MainResponse> => {
  const { data } = await axios.get<MainResponse>(`/api/main?userId=${userId}`);
  return data;
};
