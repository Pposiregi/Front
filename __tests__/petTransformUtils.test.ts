import { getTemplateAnchorRenderPx } from '../src/utils/petAnchorUtils';
import { buildPivotTransform } from '../src/utils/petTransformUtils';
import type { PetTemplate } from '../src/utils/petTemplate';

describe('petTransformUtils', () => {
  it('builds pivot transform in required order around anchor offset from center', () => {
    const transform = buildPivotTransform(
      { x: 120, y: 180 },
      320,
      { scaleX: 1.1, scaleY: 0.95, rotateDeg: 8 }
    );

    expect(transform).toEqual([
      { translateX: 40 },
      { translateY: -20 },
      { scaleX: 1.1 },
      { scaleY: 0.95 },
      { rotate: '8deg' },
      { translateX: -40 },
      { translateY: 20 },
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
      320,
      { scaleX: 1.05, translateX: 3, translateY: -2 }
    );

    expect(transform).toEqual([
      { translateX: 110 },
      { translateY: 100 },
      { scaleX: 1.05 },
      { translateX: -110 },
      { translateY: -100 },
      { translateX: 3 },
      { translateY: -2 },
    ]);
  });

  it('uses part center rotation when useAnchorPivot is false', () => {
    const transform = buildPivotTransform(
      { x: 100, y: 120 },
      320,
      { rotateDeg: '12deg', translateX: 4, useAnchorPivot: false }
    );

    expect(transform).toEqual([{ rotate: '12deg' }, { translateX: 4 }]);
  });
});
