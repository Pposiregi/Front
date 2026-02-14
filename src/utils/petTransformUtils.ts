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

type TransformArray = Exclude<NonNullable<TransformsStyle['transform']>, string>;
type TransformEntry = TransformArray extends ReadonlyArray<infer T> ? T : never;

/**
 * pivot 기반 변형이 필요한지 판단한다.
 * translate만 있는 경우는 pivot 보정이 불필요하므로 false가 된다.
 */
function hasPivotTransform(transform: PartTransformInput): boolean {
  return (
    transform.scaleX !== undefined ||
    transform.scaleY !== undefined ||
    transform.rotateDeg !== undefined
  );
}

/**
 * 파츠 변형 배열을 생성한다.
 * 핵심 아이디어:
 * - RN transform origin은 기본적으로 요소 중심이므로,
 * - 원하는 pivot(앵커)와 중심의 차이를 먼저 보정한 뒤,
 * - scale/rotate를 적용하고,
 * - 마지막에 다시 원위치로 되돌린다.
 *
 * useAnchorPivot=false이면 중심 기준 변형으로 처리한다.
 */
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
