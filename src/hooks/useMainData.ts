import { useEffect, useState } from 'react';

export const useMainData = () => {
  const [data, setData] = useState<MainResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 서버 없이 목업 데이터로 테스트
    const mock: MainResponse = {
      user: { user_id: '3', nick_name: '규리', age: 25, gender: 'F' },
      pet: {
        pet_id: 'p1',
        name: '토토',
        pet_type: 'rabbit',
        exp: 1000,
        level: 2,
        evolution_stage: '성장기',
        image_uri: 'https://placekitten.com/300/300',
        expression: 'happy',
      },
      daily_walk: {
        date: '2025-09-08',
        step: 8654,
        goal_step: 15000,
        distance_km: 1.5,
        burn_calories: 80,
      },
      ui: {
        message: '👣 8654보 걸었어요!',
        pet_expression: 'happy',
      },
    };

    // 1초 뒤 Mock 데이터 세팅
    const timer = setTimeout(() => {
      setData(mock);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //     getMainData().then((res) => {
  //         setData(res);
  //         setLoading(false);
  //     });
  // }, []);

  return { data, loading };
};
