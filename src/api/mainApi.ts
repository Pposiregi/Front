import apiClient from './httpClient';

export const getMainData = async (): Promise<MainResponse> => {
  const { data } = await apiClient.get<MainResponse>('/api/main');
  return data;
};
