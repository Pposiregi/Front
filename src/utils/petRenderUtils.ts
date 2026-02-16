import type { ImageSourcePropType } from 'react-native';
import type { PetTemplatePart } from '@utils/petTemplate';

export type SortablePetPart = PetTemplatePart & {
  _originalIndex: number;
};

/**
 * 렌더 순서를 안정적으로 보장하기 위해 파츠 배열을 정렬한다.
 * 우선순위:
 * 1) zIndex 오름차순
 * 2) key 사전순
 * 3) file 사전순
 * 4) 원본 인덱스(최종 tie-break)
 *
 * 동일 입력에 대해 항상 동일 순서를 만들기 때문에 레이어 깜빡임/순서 역전 문제를 줄인다.
 */
export function sortPetPartsForRender(parts: PetTemplatePart[]): SortablePetPart[] {
  return parts
    .map((part, index) => ({ ...part, _originalIndex: index }))
    .sort((a, b) => {
      if (a.zIndex !== b.zIndex) return a.zIndex - b.zIndex;

      const keyCompare = a.key.localeCompare(b.key);
      if (keyCompare !== 0) return keyCompare;

      const fileCompare = a.file.localeCompare(b.file);
      if (fileCompare !== 0) return fileCompare;

      return a._originalIndex - b._originalIndex;
    });
}

export type RenderablePetPart = SortablePetPart & {
  asset: ImageSourcePropType;
};

/**
 * 정렬된 파츠에 실제 이미지 에셋을 매핑해 렌더 가능한 목록을 만든다.
 * resolveAsset이 null을 반환한 파일은 missingFiles로 분리하여 렌더에서 제외한다.
 * 이 방식으로 일부 에셋 누락이 있어도 전체 렌더가 중단되지 않는다.
 */
export function buildRenderablePetParts(
  sortedParts: SortablePetPart[],
  resolveAsset: (fileName: string) => ImageSourcePropType | null
): { renderableParts: RenderablePetPart[]; missingFiles: string[] } {
  const renderableParts: RenderablePetPart[] = [];
  const missingFiles: string[] = [];

  sortedParts.forEach(part => {
    const asset = resolveAsset(part.file);
    if (asset == null) {
      missingFiles.push(part.file);
      return;
    }

    renderableParts.push({
      ...part,
      asset,
    });
  });

  return { renderableParts, missingFiles };
}
