import type { ImageSourcePropType } from 'react-native';
import {
  getPetAssetRegistryEntry,
  type PetAssetRegistryEntry,
  type PetTemplateId,
} from '@assets/pet/petAssetRegistry';
import {
  FALLBACK_PET_TEMPLATE,
  loadPetTemplateWithFallback,
  type PetTemplate,
} from '@utils/petTemplate';

const LOG_PREFIX = '[PetAssetLoader]';
const DEFAULT_TEMPLATE_ID: PetTemplateId = 'browncat_v1';
const MAX_PART_ASSET_CACHE_ENTRIES = 64;

type TemplateCacheEntry = {
  template: PetTemplate;
  version: string;
};

type CachedPartAsset = {
  asset: ImageSourcePropType;
  createdAt: number;
  lastAccessedAt: number;
};

type CacheStats = {
  templateCacheHits: number;
  templateCacheMisses: number;
  partCacheHits: number;
  partCacheMisses: number;
  decodeScheduledCount: number;
  templateCacheSize: number;
  partCacheSize: number;
};

type GetTemplateOptions = {
  templateId?: string;
  cacheBustToken?: string;
};

type GetPartAssetOptions = {
  templateId?: string;
  fileName: string;
  cacheBustToken?: string;
};

const templateCache = new Map<string, TemplateCacheEntry>();
const partAssetCache = new Map<string, CachedPartAsset>();

const stats = {
  templateCacheHits: 0,
  templateCacheMisses: 0,
  partCacheHits: 0,
  partCacheMisses: 0,
  decodeScheduledCount: 0,
};

/**
 * 템플릿 캐시 키를 생성한다.
 * templateId + version + cacheBustToken 조합으로,
 * 동일 템플릿이라도 버전/버스트가 다르면 별도 엔트리로 분리된다.
 */
function buildTemplateCacheKey(templateId: string, version: string, cacheBustToken?: string): string {
  return JSON.stringify(['tpl', templateId, version, cacheBustToken ?? '']);
}

/**
 * 파츠 에셋 캐시 키를 생성한다.
 * 템플릿 버전과 파일명을 모두 포함해 다른 파츠/버전 충돌을 방지한다.
 */
function buildPartCacheKey(
  templateId: string,
  version: string,
  fileName: string,
  cacheBustToken?: string
): string {
  return JSON.stringify(['part', templateId, version, cacheBustToken ?? '', fileName]);
}

/**
 * 레지스트리에서 템플릿 엔트리를 조회한다.
 * 없는 templateId는 null을 반환하고 명확한 에러 로그를 남긴다.
 */
function getRegistryEntryOrWarn(templateId: string): PetAssetRegistryEntry | null {
  const entry = getPetAssetRegistryEntry(templateId);
  if (!entry) {
    console.error(`${LOG_PREFIX} unknown template id "${templateId}".`);
    return null;
  }
  return entry;
}

/**
 * LRU 유사 정책을 위해 파츠 캐시 엔트리의 접근 시각을 갱신한다.
 * Map 재삽입으로 순서를 최신화한다.
 */
function touchPartEntry(cacheKey: string, entry: CachedPartAsset): void {
  partAssetCache.delete(cacheKey);
  entry.lastAccessedAt = Date.now();
  partAssetCache.set(cacheKey, entry);
}

/**
 * 파츠 캐시가 상한을 넘으면 가장 오래된 엔트리를 제거한다.
 * 현재 구현은 간단한 FIFO/LRU 혼합형으로, 메모리 급증을 빠르게 억제하는 목적이다.
 */
function evictOldestPartAssetIfNeeded(): void {
  if (partAssetCache.size <= MAX_PART_ASSET_CACHE_ENTRIES) return;
  const oldestKey = partAssetCache.keys().next().value;
  if (oldestKey) {
    partAssetCache.delete(oldestKey);
  }
}

/**
 * 템플릿을 로드하고 캐시에 저장한다.
 * - 캐시 히트 시 즉시 반환
 * - 미스 시 validate + fallback 적용 후 캐시에 저장
 */
export function getPetTemplate(options: GetTemplateOptions = {}): PetTemplate {
  const templateId = options.templateId ?? DEFAULT_TEMPLATE_ID;
  const entry = getRegistryEntryOrWarn(templateId);
  if (!entry) {
    return FALLBACK_PET_TEMPLATE;
  }

  const cacheKey = buildTemplateCacheKey(templateId, entry.version, options.cacheBustToken);
  const cached = templateCache.get(cacheKey);
  if (cached) {
    stats.templateCacheHits += 1;
    return cached.template;
  }

  stats.templateCacheMisses += 1;
  const loadedTemplate = loadPetTemplateWithFallback(entry.template, FALLBACK_PET_TEMPLATE);
  templateCache.set(cacheKey, { template: loadedTemplate, version: entry.version });
  return loadedTemplate;
}

/**
 * 단일 파츠 에셋을 로드하고 캐시에 저장한다.
 * - 캐시 히트 시 stats/touch 업데이트
 * - 누락 파일은 warn 후 null 반환
 * - 미스 시 decodeScheduledCount 증가
 */
export function getPetPartAsset(options: GetPartAssetOptions): ImageSourcePropType | null {
  const templateId = options.templateId ?? DEFAULT_TEMPLATE_ID;
  const entry = getRegistryEntryOrWarn(templateId);
  if (!entry) return null;

  const cacheKey = buildPartCacheKey(
    templateId,
    entry.version,
    options.fileName,
    options.cacheBustToken
  );

  const cached = partAssetCache.get(cacheKey);
  if (cached) {
    stats.partCacheHits += 1;
    touchPartEntry(cacheKey, cached);
    return cached.asset;
  }

  if (!(options.fileName in entry.partAssets)) {
    console.warn(
      `${LOG_PREFIX} missing part asset "${options.fileName}" in template "${templateId}".`
    );
    return null;
  }
  const asset = entry.partAssets[options.fileName];

  stats.partCacheMisses += 1;
  stats.decodeScheduledCount += 1;
  partAssetCache.set(cacheKey, {
    asset,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
  });
  evictOldestPartAssetIfNeeded();

  return asset;
}

/**
 * 템플릿의 모든 파츠를 선로딩한다.
 * 화면 진입 전 호출하면 첫 렌더 시 체감 지연을 줄일 수 있다.
 */
export function warmPetPartAssetCache(options: GetTemplateOptions = {}): {
  loadedCount: number;
  missingCount: number;
} {
  const template = getPetTemplate(options);
  let loadedCount = 0;
  let missingCount = 0;

  template.parts.forEach(part => {
    const asset = getPetPartAsset({
      templateId: options.templateId,
      fileName: part.file,
      cacheBustToken: options.cacheBustToken,
    });

    if (asset == null) {
      missingCount += 1;
      return;
    }
    loadedCount += 1;
  });

  return { loadedCount, missingCount };
}

/**
 * 캐시 무효화 함수.
 * templateId가 없으면 전체 캐시 삭제, 있으면 해당 템플릿 prefix만 삭제한다.
 */
export function invalidatePetAssetCache(options: { templateId?: string } = {}): void {
  const templateId = options.templateId;

  if (!templateId) {
    templateCache.clear();
    partAssetCache.clear();
    return;
  }

  for (const key of Array.from(templateCache.keys())) {
    if (key.includes(`"${templateId}"`)) {
      templateCache.delete(key);
    }
  }

  for (const key of Array.from(partAssetCache.keys())) {
    if (key.includes(`"${templateId}"`)) {
      partAssetCache.delete(key);
    }
  }
}

/**
 * 현재 캐시/히트 통계를 스냅샷으로 반환한다.
 * 성능 점검 및 디버깅에서 사용한다.
 */
export function getPetAssetCacheStats(): CacheStats {
  return {
    ...stats,
    templateCacheSize: templateCache.size,
    partCacheSize: partAssetCache.size,
  };
}

/**
 * 누적 통계를 0으로 리셋한다.
 * 캐시 자체는 유지하고 통계만 초기화할 때 사용한다.
 */
export function resetPetAssetCacheStats(): void {
  stats.templateCacheHits = 0;
  stats.templateCacheMisses = 0;
  stats.partCacheHits = 0;
  stats.partCacheMisses = 0;
  stats.decodeScheduledCount = 0;
}
