// 그래프 설정
import { Colors } from '@styles/theme';

const chartConfig = {
  backgroundGradientFrom: Colors.surface,
  backgroundGradientTo: Colors.surface,
  decimalPlaces: 0,
  color: () => Colors.success,
  labelColor: () => Colors.textPrimary,

  // 배경 그리드 라인
  propsForBackgroundLines: {
    stroke: Colors.divider,
    strokeDasharray: '4, 4', // 점선으로 유지
    strokeWidth: 1,
  },

  // 꼭짓점
  propsForDots: {
    r: '0', // 0으로 둬야 안 나옴;
  },
};

export default chartConfig;
