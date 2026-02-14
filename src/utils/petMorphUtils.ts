import type { PetTemplatePart } from '@utils/petTemplate';

type TorsoMorphScale = {
  scaleX: number;
  scaleY: number;
  clampedPbf: number;
  t: number;
};

export function clampPbf(pbf: number, minPbf: number, maxPbf: number): number {
  return Math.min(maxPbf, Math.max(minPbf, pbf));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

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
