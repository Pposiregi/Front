/**
 * assets > pet 내의 template.json 검사를 위함
 * - 템플릿 데이터가 정상인지 검사, 문제 발견 시 기본 템플릿으로 복구
 *
 */

type AnchorPoint = {
  x: number;
  y: number;
};

export type PetPartMorph = {
  pbf?: {
    range: {
      min: number;
      max: number;
    };
    scaleX: [number, number];
    scaleY: [number, number];
  };
};

export type PetTemplatePart = {
  key: string;
  file: string;
  zIndex: number;
  anchor: string;
  morph?: PetPartMorph;
};

export type PetTemplate = {
  id: string;
  canvas: {
    baseSize: number;
  };
  anchors: Record<string, AnchorPoint>;
  parts: PetTemplatePart[];
};

export type PetTemplateValidationResult = {
  template: PetTemplate;
  issues: string[];
  usedFallback: boolean;
};

const LOG_PREFIX = '[PetTemplate]';

export const FALLBACK_PET_TEMPLATE: PetTemplate = {
  id: 'fallback_empty_v1',
  canvas: { baseSize: 1024 },
  anchors: {
    root: { x: 0.5, y: 0.5 },
  },
  parts: [],
};

/**
 * unknown 값을 일반 객체(배열/null 제외)인지 검사한다.
 * 템플릿 파싱에서 가장 기초가 되는 타입 가드다.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 숫자이면서 NaN/Infinity가 아닌 유한값인지 검사한다.
 */
function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * 앵커 포인트 객체 형태({x:number,y:number})인지 검사한다.
 */
function isAnchorPoint(value: unknown): value is AnchorPoint {
  if (!isRecord(value)) return false;
  return isFiniteNumber(value.x) && isFiniteNumber(value.y);
}

/**
 * 정규화 앵커의 허용 범위(0..1) 검사.
 * 렌더 좌표 계산 시 범위 이탈로 인한 오프스크린/왜곡을 미리 차단한다.
 */
function isAnchorInUnitRange(anchor: AnchorPoint): boolean {
  return anchor.x >= 0 && anchor.x <= 1 && anchor.y >= 0 && anchor.y <= 1;
}

/**
 * part.morph 블록을 검증/정규화한다.
 * 형식이 맞지 않으면 issue를 기록하고 undefined를 반환해 해당 morph만 무시한다.
 */
function validateMorph(
  value: unknown,
  path: string,
  issues: string[]
): PetPartMorph | undefined {
  if (!isRecord(value)) {
    issues.push(`${path}: expected object`);
    return undefined;
  }

  const pbf = value.pbf;
  if (pbf == null) return undefined;

  if (!isRecord(pbf)) {
    issues.push(`${path}.pbf: expected object`);
    return undefined;
  }

  const range = pbf.range;
  const scaleX = pbf.scaleX;
  const scaleY = pbf.scaleY;

  if (
    !isRecord(range) ||
    !isFiniteNumber(range.min) ||
    !isFiniteNumber(range.max)
  ) {
    issues.push(`${path}.pbf.range: expected { min:number, max:number }`);
    return undefined;
  }

  if (
    !Array.isArray(scaleX) ||
    scaleX.length !== 2 ||
    !scaleX.every(isFiniteNumber)
  ) {
    issues.push(`${path}.pbf.scaleX: expected [number, number]`);
    return undefined;
  }

  if (
    !Array.isArray(scaleY) ||
    scaleY.length !== 2 ||
    !scaleY.every(isFiniteNumber)
  ) {
    issues.push(`${path}.pbf.scaleY: expected [number, number]`);
    return undefined;
  }

  return {
    pbf: {
      range: { min: range.min, max: range.max },
      scaleX: [scaleX[0], scaleX[1]],
      scaleY: [scaleY[0], scaleY[1]],
    },
  };
}

/**
 * raw 템플릿을 안전한 PetTemplate 구조로 검증/정규화한다.
 * 필드 단위로 가능한 범위는 살리고, 불가능한 영역만 fallback을 적용한다.
 * 결과에는 이슈 목록과 fallback 사용 여부를 함께 포함한다.
 */
export function validatePetTemplate(
  rawTemplate: unknown,
  fallbackTemplate: PetTemplate = FALLBACK_PET_TEMPLATE
): PetTemplateValidationResult {
  const issues: string[] = [];
  let usedFallback = false;

  if (!isRecord(rawTemplate)) {
    issues.push('template: expected object');
    return {
      template: fallbackTemplate,
      issues,
      usedFallback: true,
    };
  }

  const id =
    typeof rawTemplate.id === 'string' && rawTemplate.id.trim().length > 0
      ? rawTemplate.id
      : fallbackTemplate.id;
  if (id === fallbackTemplate.id && rawTemplate.id !== fallbackTemplate.id) {
    issues.push('id: missing or invalid string');
    usedFallback = true;
  }

  let baseSize = fallbackTemplate.canvas.baseSize;
  if (
    isRecord(rawTemplate.canvas) &&
    isFiniteNumber(rawTemplate.canvas.baseSize) &&
    rawTemplate.canvas.baseSize > 0
  ) {
    baseSize = rawTemplate.canvas.baseSize;
  } else {
    issues.push('canvas.baseSize: missing or invalid number');
    usedFallback = true;
  }

  const parsedAnchors: Record<string, AnchorPoint> = {};
  if (isRecord(rawTemplate.anchors)) {
    Object.entries(rawTemplate.anchors).forEach(([anchorKey, anchorValue]) => {
      if (!isAnchorPoint(anchorValue)) {
        issues.push(`anchors.${anchorKey}: expected { x:number, y:number }`);
        return;
      }

      if (!isAnchorInUnitRange(anchorValue)) {
        issues.push(`anchors.${anchorKey}: x/y must be in 0..1`);
        return;
      }

      parsedAnchors[anchorKey] = anchorValue;
    });
  } else {
    issues.push('anchors: missing or invalid object');
  }

  const anchors =
    Object.keys(parsedAnchors).length > 0
      ? parsedAnchors
      : fallbackTemplate.anchors;
  if (anchors === fallbackTemplate.anchors) {
    usedFallback = true;
  }

  const parsedParts: PetTemplatePart[] = [];
  if (Array.isArray(rawTemplate.parts)) {
    rawTemplate.parts.forEach((part, index) => {
      const path = `parts[${index}]`;
      if (!isRecord(part)) {
        issues.push(`${path}: expected object`);
        return;
      }

      if (typeof part.key !== 'string' || part.key.trim().length === 0) {
        issues.push(`${path}.key: missing or invalid string`);
        return;
      }

      if (typeof part.file !== 'string' || part.file.trim().length === 0) {
        issues.push(`${path}.file: missing or invalid string`);
        return;
      }

      if (!isFiniteNumber(part.zIndex)) {
        issues.push(`${path}.zIndex: missing or invalid number`);
        return;
      }

      if (typeof part.anchor !== 'string' || part.anchor.trim().length === 0) {
        issues.push(`${path}.anchor: missing or invalid string`);
        return;
      }

      if (!anchors[part.anchor]) {
        issues.push(
          `${path}.anchor: "${part.anchor}" does not exist in anchors`
        );
        return;
      }

      const normalizedPart: PetTemplatePart = {
        key: part.key,
        file: part.file,
        zIndex: part.zIndex,
        anchor: part.anchor,
      };

      if (part.morph != null) {
        const morph = validateMorph(part.morph, `${path}.morph`, issues);
        if (morph) {
          normalizedPart.morph = morph;
        }
      }

      parsedParts.push(normalizedPart);
    });
  } else {
    issues.push('parts: missing or invalid array');
  }

  const parts = Array.isArray(rawTemplate.parts)
    ? parsedParts
    : fallbackTemplate.parts;
  if (!Array.isArray(rawTemplate.parts)) {
    usedFallback = true;
  }

  if (
    parsedParts.length !==
    (Array.isArray(rawTemplate.parts) ? rawTemplate.parts.length : 0)
  ) {
    usedFallback = true;
  }

  return {
    template: {
      id,
      canvas: { baseSize },
      anchors,
      parts,
    },
    issues,
    usedFallback,
  };
}

/**
 * 검증 + 로깅 + fallback까지 포함한 고수준 로더.
 * 호출자는 반환 템플릿만 사용하면 되고, 문제 진단은 로그에서 확인할 수 있다.
 */
export function loadPetTemplateWithFallback(
  rawTemplate: unknown,
  fallbackTemplate: PetTemplate = FALLBACK_PET_TEMPLATE
): PetTemplate {
  const { template, issues, usedFallback } = validatePetTemplate(
    rawTemplate,
    fallbackTemplate
  );

  if (issues.length > 0) {
    console.error(`${LOG_PREFIX} validation issues: ${issues.join(' | ')}`);
  }

  if (usedFallback) {
    console.warn(
      `${LOG_PREFIX} fallback applied (some fields were invalid). Rendering will continue with safe defaults.`
    );
  }

  return template;
}

let cachedTemplate: PetTemplate | null = null;

/**
 * 번들된 기본 템플릿을 1회 로드 후 메모리에 캐시해 재사용한다.
 * 앱 런타임에서 가장 기본이 되는 템플릿 진입점이다.
 */
export function getBundledPetTemplate(): PetTemplate {
  if (cachedTemplate) return cachedTemplate;

  const bundledTemplate = require('@assets/pet/template.json');
  cachedTemplate = loadPetTemplateWithFallback(bundledTemplate);
  return cachedTemplate;
}
