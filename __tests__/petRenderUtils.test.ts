import { buildRenderablePetParts, sortPetPartsForRender } from '../src/utils/petRenderUtils';
import type { PetTemplatePart } from '../src/utils/petTemplate';

describe('petRenderUtils', () => {
  it('sorts parts by zIndex asc and tie-breaks by key, then file', () => {
    const parts: PetTemplatePart[] = [
      { key: 'torso', file: 'b.png', zIndex: 2, anchor: 'root' },
      { key: 'arm', file: 'c.png', zIndex: 2, anchor: 'root' },
      { key: 'arm', file: 'a.png', zIndex: 2, anchor: 'root' },
      { key: 'tail', file: 'z.png', zIndex: 1, anchor: 'root' },
    ];

    const sorted = sortPetPartsForRender(parts);
    expect(sorted.map(p => `${p.zIndex}:${p.key}:${p.file}`)).toEqual([
      '1:tail:z.png',
      '2:arm:a.png',
      '2:arm:c.png',
      '2:torso:b.png',
    ]);
  });

  it('keeps stable order when zIndex/key/file are identical', () => {
    const parts: PetTemplatePart[] = [
      { key: 'ear', file: 'same.png', zIndex: 4, anchor: 'face' },
      { key: 'ear', file: 'same.png', zIndex: 4, anchor: 'face' },
      { key: 'ear', file: 'same.png', zIndex: 4, anchor: 'face' },
    ];

    const sorted = sortPetPartsForRender(parts);
    expect(sorted.map(p => p._originalIndex)).toEqual([0, 1, 2]);
  });

  it('builds renderable parts and skips missing assets gracefully', () => {
    const sorted = sortPetPartsForRender([
      { key: 'tail', file: 'tail.png', zIndex: 0, anchor: 'root' },
      { key: 'face', file: 'face.png', zIndex: 5, anchor: 'face' },
    ]);

    const result = buildRenderablePetParts(sorted, fileName =>
      fileName === 'tail.png' ? 123 : null
    );

    expect(result.renderableParts).toHaveLength(1);
    expect(result.renderableParts[0].file).toBe('tail.png');
    expect(result.missingFiles).toEqual(['face.png']);
  });
});
