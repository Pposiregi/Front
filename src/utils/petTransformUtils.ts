import type { TransformsStyle } from 'react-native';
import type { AnchorPx } from '@utils/petAnchorUtils';

export type PartTransformInput = {
  scaleX?: number;
  scaleY?: number;
  rotateDeg?: number;
  translateX?: number;
  translateY?: number;
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

  if (hasPivotTransform(transform)) {
    result.push({ translateX: -pivot.x });
    result.push({ translateY: -pivot.y });

    if (transform.scaleX !== undefined) result.push({ scaleX: transform.scaleX });
    if (transform.scaleY !== undefined) result.push({ scaleY: transform.scaleY });
    if (transform.rotateDeg !== undefined) result.push({ rotate: `${transform.rotateDeg}deg` });

    result.push({ translateX: pivot.x });
    result.push({ translateY: pivot.y });
  }

  if (transform.translateX !== undefined) result.push({ translateX: transform.translateX });
  if (transform.translateY !== undefined) result.push({ translateY: transform.translateY });

  return result;
}
