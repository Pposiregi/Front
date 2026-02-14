import type { TransformsStyle } from 'react-native';
import type { Animated } from 'react-native';
import type { AnchorPx } from '@utils/petAnchorUtils';

type AnimatableNumeric = number | Animated.Value | Animated.AnimatedInterpolation<number>;
type AnimatableRotate =
  | number
  | string
  | Animated.AnimatedInterpolation<number | string>;

export type PartTransformInput = {
  scaleX?: AnimatableNumeric;
  scaleY?: AnimatableNumeric;
  rotateDeg?: AnimatableRotate;
  translateX?: AnimatableNumeric;
  translateY?: AnimatableNumeric;
  useAnchorPivot?: boolean;
};

function hasPivotTransform(transform: PartTransformInput): boolean {
  return (
    transform.scaleX !== undefined ||
    transform.scaleY !== undefined ||
    transform.rotateDeg !== undefined
  );
}

export function buildPivotTransform(
  pivot: AnchorPx,
  transform: PartTransformInput
): TransformsStyle['transform'] {
  const result: NonNullable<TransformsStyle['transform']> = [];
  const shouldUseAnchorPivot = transform.useAnchorPivot !== false;

  if (hasPivotTransform(transform) && shouldUseAnchorPivot) {
    result.push({ translateX: -pivot.x });
    result.push({ translateY: -pivot.y });

    if (transform.scaleX !== undefined) result.push({ scaleX: transform.scaleX });
    if (transform.scaleY !== undefined) result.push({ scaleY: transform.scaleY });
    if (transform.rotateDeg !== undefined) {
      if (typeof transform.rotateDeg === 'number') {
        result.push({ rotate: `${transform.rotateDeg}deg` });
      } else {
        result.push({ rotate: transform.rotateDeg });
      }
    }

    result.push({ translateX: pivot.x });
    result.push({ translateY: pivot.y });
  }

  if (transform.scaleX !== undefined && !shouldUseAnchorPivot) {
    result.push({ scaleX: transform.scaleX });
  }
  if (transform.scaleY !== undefined && !shouldUseAnchorPivot) {
    result.push({ scaleY: transform.scaleY });
  }
  if (transform.rotateDeg !== undefined && !shouldUseAnchorPivot) {
    if (typeof transform.rotateDeg === 'number') {
      result.push({ rotate: `${transform.rotateDeg}deg` });
    } else {
      result.push({ rotate: transform.rotateDeg });
    }
  }

  if (transform.translateX !== undefined) result.push({ translateX: transform.translateX });
  if (transform.translateY !== undefined) result.push({ translateY: transform.translateY });

  return result;
}
