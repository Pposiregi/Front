import React, { useMemo } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { getPetPartAsset, getPetTemplate } from '@utils/petAssetLoader';
import { getTemplateAnchorRenderPx } from '@utils/petAnchorUtils';
import { buildRenderablePetParts, sortPetPartsForRender } from '@utils/petRenderUtils';
import { buildPivotTransform, type PartTransformInput } from '@utils/petTransformUtils';

type Props = {
  size: number;
  templateId?: string;
  cacheBustToken?: string;
  partTransforms?: Record<string, PartTransformInput>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * 파츠 템플릿 기반 펫 렌더러.
 * 동작 순서:
 * 1) 템플릿 로드
 * 2) 파츠 정렬(zIndex stable sort)
 * 3) 에셋 resolve
 * 4) 파츠별 pivot transform 적용 후 레이어 렌더
 *
 * 파츠 누락은 렌더 중단이 아니라 skip + warn으로 처리한다.
 */
export const PetRenderer = ({
  size,
  templateId,
  cacheBustToken,
  partTransforms,
  style,
  testID = 'pet-renderer',
}: Props) => {
  const template = useMemo(
    () =>
      getPetTemplate({
        templateId,
        cacheBustToken,
      }),
    [templateId, cacheBustToken]
  );

  /**
   * 템플릿 파츠를 렌더 순서로 정렬하고, 실제 이미지 소스를 결합한다.
   * template/템플릿ID/cacheBustToken 변경 시에만 재계산한다.
   */
  const { renderableParts, missingFiles } = useMemo(() => {
    const sortedParts = sortPetPartsForRender(template.parts);
    return buildRenderablePetParts(sortedParts, fileName =>
      getPetPartAsset({
        templateId,
        fileName,
        cacheBustToken,
      })
    );
  }, [template.parts, templateId, cacheBustToken]);

  if (missingFiles.length > 0) {
    console.warn(`[PetRenderer] missing part files skipped: ${missingFiles.join(', ')}`);
  }

  return (
    <View testID={testID} style={[styles.container, { width: size, height: size }, style]}>
      {renderableParts.map(part => {
        const partTransform = partTransforms?.[part.key];
        const pivot = getTemplateAnchorRenderPx(template, part.anchor, size);
        const transform =
          partTransform && pivot
            ? buildPivotTransform(pivot, size, partTransform)
            : undefined;

        return (
          <Animated.Image
            key={`${part.zIndex}:${part.key}:${part.file}:${part._originalIndex}`}
            source={part.asset}
            style={[
              styles.layer,
              { zIndex: part.zIndex },
              transform ? { transform } : null,
            ]}
            resizeMode='contain'
            fadeDuration={0}
            testID={`pet-part-${part.key}`}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
  },
  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
