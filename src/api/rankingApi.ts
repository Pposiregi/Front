import apiClient from './httpClient';

export const getDailyStepRanking = async ({
  limit = 10,
  gender = 'ALL',
}: {
  limit?: number;
  gender?: 'ALL' | 'MALE' | 'FEMALE';
}) => {
  let url = '/users/rankings/daily-step';
  const params: any = { limit };

  if (gender === 'MALE') {
    url = '/users/rankings/daily-step/gender';
    params.gender = 'male';
  } else if (gender === 'FEMALE') {
    url = '/users/rankings/daily-step/gender';
    params.gender = 'female';
  }

  const { data } = await apiClient.get(url, { params });
  return data;
};
