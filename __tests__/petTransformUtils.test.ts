import { getTemplateAnchorRenderPx } from '../src/utils/petAnchorUtils';
import { buildPivotTransform } from '../src/utils/petTransformUtils';
import type { PetTemplate } from '../src/utils/petTemplate';

describe('petTransformUtils', () => {
  it('builds pivot transform in required order: -pivot -> transform -> +pivot', () => {
    const transform = buildPivotTransform(
      { x: 120, y: 180 },
      { scaleX: 1.1, scaleY: 0.95, rotateDeg: 8 }
    );

    expect(transform).toEqual([
      { translateX: -120 },
      { translateY: -180 },
      { scaleX: 1.1 },
      { scaleY: 0.95 },
      { rotate: '8deg' },
      { translateX: 120 },
      { translateY: 180 },
    ]);
  });

  it('references torso anchor as pivot in rendered px', () => {
    const template: PetTemplate = {
      id: 'browncat_v1',
      canvas: { baseSize: 1024 },
      anchors: {
        torso: { x: 0.5, y: 0.625 },
      },
      parts: [],
    };

    const torsoPivot = getTemplateAnchorRenderPx(template, 'torso', 320);
    expect(torsoPivot).toEqual({ x: 160, y: 200 });
  });

  it('appends additional translation after pivot-based transform', () => {
    const transform = buildPivotTransform(
      { x: 50, y: 60 },
      { scaleX: 1.05, translateX: 3, translateY: -2 }
    );

    expect(transform).toEqual([
      { translateX: -50 },
      { translateY: -60 },
      { scaleX: 1.05 },
      { translateX: 50 },
      { translateY: 60 },
      { translateX: 3 },
      { translateY: -2 },
    ]);
  });
});
