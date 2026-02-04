import React, { useState } from 'react';
import { Modal, View, Text, Pressable, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { ProfileAvatar } from '@components/ProfileAvatar';
import userSlice from '@slices/user';
import styles from '@styles/ProfileImageModal.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentImageId: number;
};

const PROFILE_IMAGE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function ProfileImageModal({
  visible,
  onClose,
  currentImageId,
}: Props) {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(currentImageId);

  const handleSave = () => {
    dispatch(
      userSlice.actions.setUser({
        profileImageId: selectedId,
      })
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>프로필 이미지 선택</Text>

          <FlatList
            data={PROFILE_IMAGE_IDS}
            numColumns={3}
            keyExtractor={(item) => item.toString()}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => {
              const selected = item === selectedId;
              return (
                <Pressable
                  onPress={() => setSelectedId(item)}
                  style={[styles.avatarWrapper, selected && styles.selected]}
                >
                  <ProfileAvatar profileImageId={item} />
                </Pressable>
              );
            }}
          />

          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveText}>저장</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
