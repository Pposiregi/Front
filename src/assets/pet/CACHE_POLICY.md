# FitPet Pet Asset Cache Policy

## 목적
- 동일 펫을 반복 렌더링할 때 템플릿 파싱/에셋 조회를 반복하지 않도록 캐시한다.
- 파츠 이미지 decode 스케줄을 중복으로 걸지 않도록 동일 키 재요청은 캐시 히트로 처리한다.

## 캐시 키
- Template cache key:
  - `{templateId}:{version}:{cacheBustToken}`
- Part asset cache key:
  - `{templateId}:{version}:{cacheBustToken}:{fileName}`

## 캐시 무효화 조건
- 앱에서 명시적으로 `invalidatePetAssetCache()` 호출 시 즉시 무효화
- 동일 템플릿이라도 `cacheBustToken`이 달라지면 새 키로 분리되어 이전 캐시를 사용하지 않음
- 템플릿 `version`이 변경되면 cache key가 달라져 자동으로 이전 캐시와 분리됨

## 메모리 제한/정리 전략
- 파츠 에셋 캐시는 최대 64개 항목까지만 유지
- 상한 초과 시 가장 오래된 항목 1개를 제거하는 LRU 방식으로 정리
- 템플릿 캐시는 항목 수가 작아 별도 상한 없이 관리하되, 필요 시 `invalidatePetAssetCache`로 정리

## 운영 확인 지표
- `getPetAssetCacheStats()`로 다음 지표를 수집
  - `templateCacheHits`, `templateCacheMisses`
  - `partCacheHits`, `partCacheMisses`
  - `decodeScheduledCount`
  - `templateCacheSize`, `partCacheSize`

## 기대 효과
- 동일 펫 재렌더 시 part cache hit 비율이 증가한다.
- 정상 경로에서 `decodeScheduledCount`는 첫 로드 이후 급격히 늘지 않는다.
