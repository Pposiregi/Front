import { Dimensions } from 'react-native';

import { Radius } from './radius';
import { Spacing } from './spacing';

const BASE_WIDTH = 390;
const MIN_DENSITY = 0.92;
const MAX_DENSITY = 1.12;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const layoutDensity = clamp(
  SCREEN_WIDTH / BASE_WIDTH,
  MIN_DENSITY,
  MAX_DENSITY
);

export const layoutScale = (
  size: number,
  min = Math.round(size * MIN_DENSITY),
  max = Math.round(size * MAX_DENSITY)
) => clamp(Math.round(size * layoutDensity), min, max);

export const screenPadding = layoutScale(20, Spacing.lg, Spacing.xxl);
export const cardRadius = layoutScale(20, Radius.lg, Radius.xl + 4);
export const bottomContentPadding = layoutScale(52, 40, 64);

export const Layout = {
  density: layoutDensity,
  scale: layoutScale,
  screenPadding,
  cardRadius,
  bottomContentPadding,
};
