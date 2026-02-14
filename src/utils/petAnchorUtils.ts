import type { PetTemplate } from '@utils/petTemplate';

export type AnchorNorm = {
  x: number;
  y: number;
};

export type AnchorPx = {
  x: number;
  y: number;
};

/**
 * 정규화 좌표(0..1)를 기준 캔버스 픽셀 좌표로 변환한다.
 * 예: baseSize=1024, x=0.5 -> 512px.
 */
export function anchorNormToBasePx(anchorNorm: AnchorNorm, baseSize: number): AnchorPx {
  return {
    x: anchorNorm.x * baseSize,
    y: anchorNorm.y * baseSize,
  };
}

/**
 * 기준 캔버스 대비 실제 렌더 크기 배율을 계산한다.
 * 이 배율은 모든 앵커 픽셀 좌표에 동일하게 적용된다.
 */
export function getRenderScale(baseSize: number, renderSizePx: number): number {
  return renderSizePx / baseSize;
}

/**
 * 기준 캔버스 픽셀 좌표를 실제 렌더링 크기에 맞는 픽셀 좌표로 스케일한다.
 */
export function scaleAnchorPx(anchorPx: AnchorPx, renderScale: number): AnchorPx {
  return {
    x: anchorPx.x * renderScale,
    y: anchorPx.y * renderScale,
  };
}

/**
 * 정규화 앵커를 실제 렌더 좌표로 한 번에 변환한다.
 * 내부적으로는:
 * 1) 정규화 -> base px
 * 2) 배율 계산
 * 3) 렌더 px 스케일
 * 순서를 고정해 일관된 결과를 보장한다.
 */
export function anchorToRenderPx(
  anchorNorm: AnchorNorm,
  baseSize: number,
  renderSizePx: number
): AnchorPx {
  const basePx = anchorNormToBasePx(anchorNorm, baseSize);
  const renderScale = getRenderScale(baseSize, renderSizePx);
  return scaleAnchorPx(basePx, renderScale);
}

/**
 * 템플릿에서 특정 anchorKey를 찾아 현재 렌더 크기 기준 픽셀로 반환한다.
 * 템플릿에 해당 키가 없으면 null을 반환해 호출부가 안전하게 fallback 처리할 수 있게 한다.
 */
export function getTemplateAnchorRenderPx(
  template: PetTemplate,
  anchorKey: string,
  renderSizePx: number
): AnchorPx | null {
  const anchorNorm = template.anchors[anchorKey];
  if (!anchorNorm) return null;

  return anchorToRenderPx(anchorNorm, template.canvas.baseSize, renderSizePx);
}
