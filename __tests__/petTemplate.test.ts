import {
  FALLBACK_PET_TEMPLATE,
  loadPetTemplateWithFallback,
  validatePetTemplate,
} from '../src/utils/petTemplate';

describe('petTemplate validator', () => {
  it('detects missing required fields and applies fallback', () => {
    const result = validatePetTemplate({});

    expect(result.usedFallback).toBe(true);
    expect(result.template.canvas.baseSize).toBe(FALLBACK_PET_TEMPLATE.canvas.baseSize);
    expect(result.template.anchors).toEqual(FALLBACK_PET_TEMPLATE.anchors);
    expect(result.template.parts).toEqual([]);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        'canvas.baseSize: missing or invalid number',
        'anchors: missing or invalid object',
        'parts: missing or invalid array',
      ])
    );
  });

  it('detects wrong field types and drops invalid parts safely', () => {
    const rawTemplate = {
      id: 'browncat_v1',
      canvas: { baseSize: '1024' },
      anchors: {
        root: { x: 0.5, y: '0.8' },
      },
      parts: [
        {
          key: 'tail',
          file: 'browncat_v1_00_tail_none.png',
          zIndex: '0',
          anchor: 'root',
        },
      ],
    };

    const result = validatePetTemplate(rawTemplate);

    expect(result.usedFallback).toBe(true);
    expect(result.template.canvas.baseSize).toBe(FALLBACK_PET_TEMPLATE.canvas.baseSize);
    expect(result.template.anchors).toEqual(FALLBACK_PET_TEMPLATE.anchors);
    expect(result.template.parts).toEqual([]);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        'canvas.baseSize: missing or invalid number',
        'anchors.root: expected { x:number, y:number }',
        'parts[0].zIndex: missing or invalid number',
      ])
    );
  });

  it('logs issues with field names and returns safe template', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadPetTemplateWithFallback({ canvas: {} });

    expect(result).toBeDefined();
    expect(errorSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();

    const errorMessage = String(errorSpy.mock.calls[0][0]);
    expect(errorMessage).toContain('canvas.baseSize');
    expect(errorMessage).toContain('anchors');
    expect(errorMessage).toContain('parts');

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
