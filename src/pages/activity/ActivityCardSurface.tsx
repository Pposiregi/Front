import React from 'react';
import { View } from 'react-native';
import { styles } from '@styles/Activity.styles';

/**
 * 러닝 기록 카드에 공통으로 깔리는 단색 표면.
 */
function ActivityCardSurface() {
  return <View pointerEvents='none' style={styles.cardSurfaceLayer} />;
}

export default ActivityCardSurface;
