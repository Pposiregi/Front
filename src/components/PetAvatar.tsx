import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

type Props = { uri: string; expression?: string; onPress?: () => void };

/***
 * PetAvatar Component
 * @param uri - 펫 이미지 URL
 * @param expression - 펫 감정 (현재 미사용)
 * @param onPress - 클릭 시 호출되는 함수
 */
export const PetAvatar = ({ uri, expression: _expression, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri }} style={styles.image} resizeMode='contain' />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 500,
  },
});
