import { useEffect, useState } from 'react';

export const useMainData() => {
  const [data, setData] = useState<MainResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 서버 없이 목업 데이터로 테스트
    const mock: MainResponse = {
      user: { user_id: '3', nick_name: '규리', age: 25, gender: 'F' },
    };

    // 1초 뒤 Mock 데이터 세팅
    const timer = setTimeout(() => {
      setData(mock);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //     getMainData(userId).then((res) => {
  //         setData(res);
  //         setLoading(false);
  //     });
  // }, [userId]);

  return { data, loading };
};
