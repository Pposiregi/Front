// 그래프 설정
const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

  // 배경 그리드 라인
  propsForBackgroundLines: {
    stroke: '#F0F0F0',
    strokeDasharray: '4, 4', // 점선으로 유지
    strokeWidth: 1,
  },

  // 꼭짓점
  propsForDots: {
    r: '0', // 0으로 둬야 안 나옴;
  },
};

export default chartConfig;
