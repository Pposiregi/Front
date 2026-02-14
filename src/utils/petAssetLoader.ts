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

function buildTemplateCacheKey(templateId: string, version: string, cacheBustToken?: string): string {
  return `${templateId}:${version}:${cacheBustToken ?? ''}`;
}

function buildPartCacheKey(
  templateId: string,
  version: string,
  fileName: string,
  cacheBustToken?: string
): string {
  return `${templateId}:${version}:${cacheBustToken ?? ''}:${fileName}`;
}

function getRegistryEntryOrWarn(templateId: string): PetAssetRegistryEntry | null {
  const entry = getPetAssetRegistryEntry(templateId);
  if (!entry) {
    console.error(`${LOG_PREFIX} unknown template id "${templateId}".`);
    return null;
  }
  return entry;
}

function touchPartEntry(cacheKey: string, entry: CachedPartAsset): void {
  partAssetCache.delete(cacheKey);
  entry.lastAccessedAt = Date.now();
  partAssetCache.set(cacheKey, entry);
}

function evictOldestPartAssetIfNeeded(): void {
  if (partAssetCache.size <= MAX_PART_ASSET_CACHE_ENTRIES) return;
  const oldestKey = partAssetCache.keys().next().value;
  if (oldestKey) {
    partAssetCache.delete(oldestKey);
  }
}

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

export function invalidatePetAssetCache(options: { templateId?: string } = {}): void {
  const templateId = options.templateId;

  if (!templateId) {
    templateCache.clear();
    partAssetCache.clear();
    return;
  }

  for (const key of Array.from(templateCache.keys())) {
    if (key.startsWith(`${templateId}:`)) {
      templateCache.delete(key);
    }
  }

  for (const key of Array.from(partAssetCache.keys())) {
    if (key.startsWith(`${templateId}:`)) {
      partAssetCache.delete(key);
    }
  }
}

export function getPetAssetCacheStats(): CacheStats {
  return {
    ...stats,
    templateCacheSize: templateCache.size,
    partCacheSize: partAssetCache.size,
  };
}

export function resetPetAssetCacheStats(): void {
  stats.templateCacheHits = 0;
  stats.templateCacheMisses = 0;
  stats.partCacheHits = 0;
  stats.partCacheMisses = 0;
  stats.decodeScheduledCount = 0;
}
