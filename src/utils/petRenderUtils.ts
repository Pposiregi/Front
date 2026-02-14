import type { ImageSourcePropType } from 'react-native';
import type { PetTemplatePart } from '@utils/petTemplate';

export type SortablePetPart = PetTemplatePart & {
  _originalIndex: number;
};

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
