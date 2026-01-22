import type {
  BodyHistoryCreateRequest,
  BodyHistoryResponse,
  BodyHistoryUpdateRequest,
} from 'types/bodyHistory';
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

export const getBodyHistoriesByUser =
  async (): Promise<BodyHistoryResponse[]> => {
  const { data } = await apiClient.get<BodyHistoryResponse[]>(
    `${BASE_PATH}`
  );
  return data;
};

export const getBodyHistoryByDate = async (
  date: string
): Promise<BodyHistoryResponse> => {
  const { data } = await apiClient.get<BodyHistoryResponse>(
    `${BASE_PATH}/date`,
    { params: { date } }
  );
  return data;
};
