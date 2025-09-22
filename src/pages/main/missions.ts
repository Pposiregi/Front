/**
 * 화면에서 사용하는 임시미션정보
 * - current: 현재 진행 상황
 * - goal: 목표 수치
 * - unit: 단위 (보, km 등)
 */
export type Mission = {
  id: string;
  title: string;
  current: number;
  goal: number;
  unit: string;
};

/**
 * 서버에서 받은 메인 응답 데이터를 화면용 미션 배열로 변환
 */
export const getMissions = (
  data: MainResponse,
  options?: { stepOverride?: number }
): Mission[] => [
  {
    id: 'walk',
    // 목표 걸음 수를 제목으로 사용 (예: '5000보 걷기')
    title: `${data.daily_walk.goal_step}보 걷기`,
    current:
      typeof options?.stepOverride === 'number'
        ? options.stepOverride
        : data.daily_walk.step,
    goal: data.daily_walk.goal_step,
    unit: '보',
  },
  {
    id: 'run',
    title: '3km 달리기',
    current: data.daily_walk.distance_km,
    goal: 3,
    unit: 'km',
  },
  {
    id: 'cal',
    title: '100kcal 소모',
    current: data.daily_walk.burn_calories,
    goal: 100,
    unit: 'kcal',
  },
];
