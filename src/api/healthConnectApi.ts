import apiClient from './httpClient';
/***
 * 헬스 커넥트에서 걸음 수 이정표 데이터를 서버로 전송하기 위한 타입 및 함수 정의
 * @module healthConnectApi
 * @author MANDARIN
 * @date 2025-10-26
 *
 */

const STEP_MILESTONES_ENDPOINT = '/api/health/steps/milestones';

export type StepMilestoneUpdate = {
  milestone: number;
  stepCount: number;
  recordedAt: string;
};

export type StepMilestonePayload = {
  userId: string;
  date: string;
  source: 'health_connect';
  milestones: StepMilestoneUpdate[];
};

export const postStepMilestones = (payload: StepMilestonePayload) => {
  return apiClient.post(STEP_MILESTONES_ENDPOINT, payload);
};
