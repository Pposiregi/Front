import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, Pressable, FlatList, Alert } from 'react-native';
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

/** 이스터에그 설정 */
const MOE_PROFILE_IMAGE_IDS = [10, 11, 12, 13, 14, 15];
const SECRET_TARGET_ID = 7;
const SECRET_TAP_REQUIRED = 5;
const TAP_TIMEOUT = 2000; // ms

export default function ProfileImageModal({
  visible,
  onClose,
  currentImageId,
}: Props) {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(currentImageId);

  /** 이스터에그 설정 */
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);

  /** 모달 열릴 때 초기화 */
  useEffect(() => {
    if (visible) {
      setSelectedId(currentImageId);
      setTapCount(0);
      setLastTapTime(null);
    }
  }, [visible, currentImageId]);

  /** 실제 FlatList에 보여줄 이미지 목록 */
  const imageList = useMemo(() => {
    return secretUnlocked
      ? [...PROFILE_IMAGE_IDS, ...MOE_PROFILE_IMAGE_IDS]
      : PROFILE_IMAGE_IDS;
  }, [secretUnlocked]);

  /** 아바타 클릭 핸들러 */
  const handleAvatarPress = (id: number) => {
    setSelectedId(id);

    // 이미 언락됐거나, 타겟 아이콘이 아니면 무시
    if (secretUnlocked || id !== SECRET_TARGET_ID) return;

    const now = Date.now();

    if (lastTapTime && now - lastTapTime > TAP_TIMEOUT) {
      setTapCount(1);
    } else {
      setTapCount((prev) => prev + 1);
    }

    setLastTapTime(now);
  };

  /** 5번 달성 시 언락 */
  useEffect(() => {
    if (tapCount >= SECRET_TAP_REQUIRED) {
      setSecretUnlocked(true);
      setTapCount(0);

      Alert.alert('🎉 숨겨진 프로필 해제!', '특수 프로필 이미지가 열렸어요.');
    }
  }, [tapCount]);

  const resetSecretState = () => {
    setSecretUnlocked(false);
    setTapCount(0);
    setLastTapTime(null);
  };

  const handleClose = () => {
    resetSecretState();
    onClose();
  };

  const handleSave = () => {
    dispatch(userSlice.actions.updateProfileImageId(selectedId));
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>프로필 이미지 선택</Text>

          <FlatList
            data={imageList}
            numColumns={3}
            keyExtractor={(item) => item.toString()}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => {
              const selected = item === selectedId;

              return (
                <Pressable
                  onPress={() => handleAvatarPress(item)}
                  style={[styles.avatarWrapper, selected && styles.selected]}
                >
                  <ProfileAvatar profileImageId={item} />
                </Pressable>
              );
            }}
          />

          <View style={styles.footer}>
            <Pressable onPress={handleClose} style={styles.cancelBtn}>
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

// import React, { useState } from 'react'; import { Modal, View, Text, Pressable, FlatList } from 'react-native'; import { useDispatch } from 'react-redux'; import { ProfileAvatar } from '@components/ProfileAvatar'; import userSlice from '@slices/user'; import styles from '@styles/ProfileImageModal.styles'; type Props = { visible: boolean; onClose: () => void; currentImageId: number; }; const PROFILE_IMAGE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9]; export default function ProfileImageModal({ visible, onClose, currentImageId, }: Props) { const dispatch = useDispatch(); const [selectedId, setSelectedId] = useState(currentImageId); const handleSave = () => { dispatch(userSlice.actions.updateProfileImageId(selectedId)); onClose(); }; return ( <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose} > <View style={styles.backdrop}> <View style={styles.container}> <Text style={styles.title}>프로필 이미지 선택</Text> <FlatList data={PROFILE_IMAGE_IDS} numColumns={3} keyExtractor={(item) => item.toString()} columnWrapperStyle={styles.row} renderItem={({ item }) => { const selected = item === selectedId; return ( <Pressable onPress={() => setSelectedId(item)} style={[styles.avatarWrapper, selected && styles.selected]} > <ProfileAvatar profileImageId={item} /> </Pressable> ); }} /> <View style={styles.footer}> <Pressable onPress={onClose} style={styles.cancelBtn}> <Text style={styles.cancelText}>취소</Text> </Pressable> <Pressable onPress={handleSave} style={styles.saveBtn}> <Text style={styles.saveText}>저장</Text> </Pressable> </View> </View> </View> </Modal> ); }
