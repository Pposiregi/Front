import {
  BodyHistoryCreateRequest,
  BodyHistoryResponse,
  BodyHistoryUpdateRequest,
} from '@types/bodyHistory';
import apiClient from './httpClient';

const BASE_PATH = '/body-histories';

export const createBodyHistory = async (
  payload: BodyHistoryCreateRequest
): Promise<BodyHistoryResponse> => {
  const { data } = await apiClient.post<BodyHistoryResponse>(
    `${BASE_PATH}`,
    payload
  );
  return data;
};

export const updateBodyHistory = async (
  historyId: number,
  payload: BodyHistoryUpdateRequest
): Promise<BodyHistoryResponse> => {
  const { data } = await apiClient.patch<BodyHistoryResponse>(
    `${BASE_PATH}/${historyId}`,
    payload
  );
  return data;
};

export const getBodyHistoriesByUser = async (
  userId: number
): Promise<BodyHistoryResponse[]> => {
  const { data } = await apiClient.get<BodyHistoryResponse[]>(
    `${BASE_PATH}/users/${userId}`
  );
  return data;
};

export const getBodyHistoryByDate = async (
  userId: number,
  date: string
): Promise<BodyHistoryResponse> => {
  const { data } = await apiClient.get<BodyHistoryResponse>(
    `${BASE_PATH}/users/${userId}/date`,
    { params: { date } }
  );
  return data;
};
