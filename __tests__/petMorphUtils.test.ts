import { clampPbf, getTorsoScaleByPbf, lerp } from '../src/utils/petMorphUtils';
import type { PetTemplatePart } from '../src/utils/petTemplate';

describe('petMorphUtils', () => {
  it('clamps pbf to min/max range', () => {
    expect(clampPbf(8, 10, 40)).toBe(10);
    expect(clampPbf(25, 10, 40)).toBe(25);
    expect(clampPbf(52, 10, 40)).toBe(40);
  });

  it('linearly interpolates numeric values', () => {
    expect(lerp(1, 2, 0)).toBe(1);
    expect(lerp(1, 2, 0.5)).toBe(1.5);
    expect(lerp(1, 2, 1)).toBe(2);
  });

  it('returns identity scale when torso morph is missing', () => {
    const torsoPart: PetTemplatePart = {
      key: 'torso',
      file: 'browncat_v1_02_torso_none.png',
      zIndex: 2,
      anchor: 'torso',
    };

    expect(getTorsoScaleByPbf(torsoPart, 25)).toEqual({
      scaleX: 1,
      scaleY: 1,
      clampedPbf: 25,
      t: 0,
    });
  });

  it('applies pbf normalization and torso scaling from morph definition', () => {
    const torsoPart: PetTemplatePart = {
      key: 'torso',
      file: 'browncat_v1_02_torso_none.png',
      zIndex: 2,
      anchor: 'torso',
      morph: {
        pbf: {
          range: { min: 10, max: 40 },
          scaleX: [1.0, 1.18],
          scaleY: [1.0, 1.05],
        },
      },
    };

    const middle = getTorsoScaleByPbf(torsoPart, 25);
    expect(middle.clampedPbf).toBe(25);
    expect(middle.t).toBeCloseTo(0.5);
    expect(middle.scaleX).toBeCloseTo(1.09);
    expect(middle.scaleY).toBeCloseTo(1.025);

    const aboveMax = getTorsoScaleByPbf(torsoPart, 100);
    expect(aboveMax.clampedPbf).toBe(40);
    expect(aboveMax.t).toBe(1);
    expect(aboveMax.scaleX).toBeCloseTo(1.18);
    expect(aboveMax.scaleY).toBeCloseTo(1.05);
  });
});
