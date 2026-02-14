import {
  getPetAssetCacheStats,
  getPetPartAsset,
  getPetTemplate,
  invalidatePetAssetCache,
  resetPetAssetCacheStats,
  warmPetPartAssetCache,
} from '../src/utils/petAssetLoader';

describe('petAssetLoader cache', () => {
  beforeEach(() => {
    invalidatePetAssetCache();
    resetPetAssetCacheStats();
  });

  it('caches template load results', () => {
    const t1 = getPetTemplate();
    const t2 = getPetTemplate();

    expect(t1.id).toBe('browncat_v1');
    expect(t2.id).toBe('browncat_v1');

    const stats = getPetAssetCacheStats();
    expect(stats.templateCacheMisses).toBe(1);
    expect(stats.templateCacheHits).toBe(1);
  });

  it('caches part assets and avoids repeated decode scheduling for same key', () => {
    const fileName = 'browncat_v1_02_torso_none.png';
    const a1 = getPetPartAsset({ fileName });
    const a2 = getPetPartAsset({ fileName });

    expect(a1).toBeTruthy();
    expect(a1).toBe(a2);

    const stats = getPetAssetCacheStats();
    expect(stats.partCacheMisses).toBe(1);
    expect(stats.partCacheHits).toBe(1);
    expect(stats.decodeScheduledCount).toBe(1);
  });

  it('gracefully returns null when part asset is missing', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const asset = getPetPartAsset({ fileName: 'missing_file.png' });

    expect(asset).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('warms all template parts into cache', () => {
    const result = warmPetPartAssetCache();

    expect(result.missingCount).toBe(0);
    expect(result.loadedCount).toBeGreaterThan(0);

    const stats = getPetAssetCacheStats();
    expect(stats.partCacheSize).toBe(result.loadedCount);
    expect(stats.decodeScheduledCount).toBe(result.loadedCount);
  });

  it('invalidates by template id', () => {
    getPetTemplate();
    getPetPartAsset({ fileName: 'browncat_v1_02_torso_none.png' });

    let stats = getPetAssetCacheStats();
    expect(stats.templateCacheSize).toBeGreaterThan(0);
    expect(stats.partCacheSize).toBeGreaterThan(0);

    invalidatePetAssetCache({ templateId: 'browncat_v1' });

    stats = getPetAssetCacheStats();
    expect(stats.templateCacheSize).toBe(0);
    expect(stats.partCacheSize).toBe(0);
  });
});
