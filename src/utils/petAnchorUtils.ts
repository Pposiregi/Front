import type { PetTemplate } from '@utils/petTemplate';

export type AnchorNorm = {
  x: number;
  y: number;
};

export type AnchorPx = {
  x: number;
  y: number;
};

export function anchorNormToBasePx(anchorNorm: AnchorNorm, baseSize: number): AnchorPx {
  return {
    x: anchorNorm.x * baseSize,
    y: anchorNorm.y * baseSize,
  };
}

export function getRenderScale(baseSize: number, renderSizePx: number): number {
  return renderSizePx / baseSize;
}

export function scaleAnchorPx(anchorPx: AnchorPx, renderScale: number): AnchorPx {
  return {
    x: anchorPx.x * renderScale,
    y: anchorPx.y * renderScale,
  };
}

export function anchorToRenderPx(
  anchorNorm: AnchorNorm,
  baseSize: number,
  renderSizePx: number
): AnchorPx {
  const basePx = anchorNormToBasePx(anchorNorm, baseSize);
  const renderScale = getRenderScale(baseSize, renderSizePx);
  return scaleAnchorPx(basePx, renderScale);
}

export function getTemplateAnchorRenderPx(
  template: PetTemplate,
  anchorKey: string,
  renderSizePx: number
): AnchorPx | null {
  const anchorNorm = template.anchors[anchorKey];
  if (!anchorNorm) return null;

  return anchorToRenderPx(anchorNorm, template.canvas.baseSize, renderSizePx);
}
