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
