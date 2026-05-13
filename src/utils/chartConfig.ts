// 그래프 설정
import { Colors } from '@styles/theme';

const hexToRgba = (hex: string, opacity = 1) => {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const chartConfig = {
  backgroundGradientFrom: Colors.surface,
  backgroundGradientTo: Colors.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => hexToRgba(Colors.success, opacity),
  labelColor: (opacity = 1) => hexToRgba(Colors.textPrimary, opacity),

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
