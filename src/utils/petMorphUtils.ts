import type { PetTemplatePart } from '@utils/petTemplate';

type TorsoMorphScale = {
  scaleX: number;
  scaleY: number;
  clampedPbf: number;
  t: number;
};

/**
 * pbf 값을 템플릿 정의 범위로 제한한다.
 * 범위를 벗어난 입력이 들어와도 렌더 결과가 튀지 않도록 안전하게 clamp한다.
 */
export function clampPbf(pbf: number, minPbf: number, maxPbf: number): number {
  return Math.min(maxPbf, Math.max(minPbf, pbf));
}

/**
 * 선형 보간 함수.
 * t=0이면 start, t=1이면 end, 그 사이는 비례값을 반환한다.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * torso 파츠의 morph.pbf 정의를 읽어 현재 pbf에 대응하는 scale을 계산한다.
 * 반환값의 t는 정규화 진행도(0..1)이며,
 * follow-offset 등 후속 모션 보정에서 재사용할 수 있도록 함께 제공한다.
 */
export function getTorsoScaleByPbf(part: PetTemplatePart | undefined, pbf: number): TorsoMorphScale {
  const morph = part?.morph?.pbf;
  if (!morph) {
    return { scaleX: 1, scaleY: 1, clampedPbf: pbf, t: 0 };
  }

  const minPbf = morph.range.min;
  const maxPbf = morph.range.max;
  const clampedPbf = clampPbf(pbf, minPbf, maxPbf);
  const denom = maxPbf - minPbf;
  const t = denom <= 0 ? 0 : (clampedPbf - minPbf) / denom;

  return {
    scaleX: lerp(morph.scaleX[0], morph.scaleX[1], t),
    scaleY: lerp(morph.scaleY[0], morph.scaleY[1], t),
    clampedPbf,
    t,
  };
}
