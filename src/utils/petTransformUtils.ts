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
  stretchCenterX?: AnimatableNumeric;
  stretchTopLockNorm?: number;
  stretchBottomLockNorm?: number;
  stretchTopLeftNormX?: number;
  stretchTopRightNormX?: number;
  stretchBottomLeftNormX?: number;
  stretchBottomRightNormX?: number;
  useAnchorPivot?: boolean;
};

type TransformArray = Exclude<NonNullable<TransformsStyle['transform']>, string>;
type TransformEntry = TransformArray extends ReadonlyArray<infer T> ? T : never;

function hasPivotTransform(transform: PartTransformInput): boolean {
  return (
    transform.scaleX !== undefined ||
    transform.scaleY !== undefined ||
    transform.rotateDeg !== undefined
  );
}

export function buildPivotTransform(
  pivot: AnchorPx,
  renderSize: number,
  transform: PartTransformInput
): TransformArray {
  const result: TransformEntry[] = [];
  const shouldUseAnchorPivot = transform.useAnchorPivot !== false;

  if (hasPivotTransform(transform) && shouldUseAnchorPivot) {
    // RN transforms are centered by default. Shift object so pivot matches center,
    // apply transform, then shift back.
    const center = renderSize / 2;
    const pivotOffsetX = pivot.x - center;
    const pivotOffsetY = pivot.y - center;

    result.push({ translateX: -pivotOffsetX });
    result.push({ translateY: -pivotOffsetY });

    if (transform.scaleX !== undefined) result.push({ scaleX: transform.scaleX });
    if (transform.scaleY !== undefined) result.push({ scaleY: transform.scaleY });
    if (transform.rotateDeg !== undefined) {
      if (typeof transform.rotateDeg === 'number') {
        result.push({ rotate: `${transform.rotateDeg}deg` });
      } else {
        result.push({ rotate: transform.rotateDeg });
      }
    }

    result.push({ translateX: pivotOffsetX });
    result.push({ translateY: pivotOffsetY });
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
