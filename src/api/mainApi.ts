import apiClient from './httpClient';

export const getMainData = async (userId: string): Promise<MainResponse> => {
  const { data } = await apiClient.get<MainResponse>(
    `/api/main?userId=${userId}`
  );
  return data;
};
