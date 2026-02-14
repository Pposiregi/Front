import {
  anchorNormToBasePx,
  anchorToRenderPx,
  getRenderScale,
  getTemplateAnchorRenderPx,
  scaleAnchorPx,
} from '../src/utils/petAnchorUtils';
import type { PetTemplate } from '../src/utils/petTemplate';

describe('petAnchorUtils', () => {
  it('converts normalized anchor to base px', () => {
    const px = anchorNormToBasePx({ x: 0.25, y: 0.75 }, 1024);
    expect(px).toEqual({ x: 256, y: 768 });
  });

  it('keeps transform order consistent: norm->base px->scale', () => {
    const basePx = anchorNormToBasePx({ x: 0.4, y: 0.6 }, 1024);
    const renderScale = getRenderScale(1024, 256);
    const sequential = scaleAnchorPx(basePx, renderScale);
    const direct = anchorToRenderPx({ x: 0.4, y: 0.6 }, 1024, 256);

    expect(sequential).toEqual(direct);
    expect(direct).toEqual({ x: 102.4, y: 153.6 });
  });

  it('uses template baseSize (not fixed 1024)', () => {
    const template: PetTemplate = {
      id: 'custom_v1',
      canvas: { baseSize: 2048 },
      anchors: {
        pivot: { x: 0.5, y: 0.25 },
      },
      parts: [],
    };

    const px = getTemplateAnchorRenderPx(template, 'pivot', 512);
    expect(px).toEqual({ x: 256, y: 128 });
  });

  it('returns null if anchor key does not exist', () => {
    const template: PetTemplate = {
      id: 'custom_v1',
      canvas: { baseSize: 1024 },
      anchors: {
        root: { x: 0.5, y: 0.5 },
      },
      parts: [],
    };

    expect(getTemplateAnchorRenderPx(template, 'missing', 280)).toBeNull();
  });
});
