import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { ProfileAvatar } from '@components/ProfileAvatar';
import userSlice from '@slices/user';
import styles from '@styles/ProfileImageModal.styles';
import {
  PROFILE_PRESET_URLS,
  SECRET_PRESET_URLS,
  SECRET_TARGET_URL,
} from '@shared/constants/profileIcons';
import { requestProfileImageUpload, updateUserProfile } from '@api/profileApi';
import { uploadMealImage } from '@api/uploadMealImage';
import { getUser } from '@api/mainApi';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentImageUrl: string;
};

const SECRET_TAP_REQUIRED = 5;
const TAP_TIMEOUT = 2000; // ms

export default function ProfileImageModal({
  visible,
  onClose,
  currentImageUrl,
}: Props) {
  const dispatch = useDispatch();
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);

  /** 이스터에그 상태 */
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);

  /** 모달 열릴 때 초기화 */
  useEffect(() => {
    if (visible) {
      setSelectedUrl(currentImageUrl);
      setTapCount(0);
      setLastTapTime(null);
    }
  }, [visible, currentImageUrl]);

  const imageList = useMemo(() => {
    return secretUnlocked
      ? [...PROFILE_PRESET_URLS, ...SECRET_PRESET_URLS]
      : PROFILE_PRESET_URLS;
  }, [secretUnlocked]);

  const handleAvatarPress = (url: string) => {
    setSelectedUrl(url);

    if (secretUnlocked || url !== SECRET_TARGET_URL) return;

    const now = Date.now();
    if (lastTapTime && now - lastTapTime > TAP_TIMEOUT) {
      setTapCount(1);
    } else {
      setTapCount((prev) => prev + 1);
    }
    setLastTapTime(now);
  };

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

  /** 프리셋 선택 저장 */
  const handleSave = async () => {
    try {
      setUploading(true);
      await updateUserProfile({ profileImageUrl: selectedUrl });
      dispatch(userSlice.actions.updateProfileImageUrl(selectedUrl));
      handleClose();
    } catch {
      Alert.alert('저장 실패', '프로필 이미지를 저장하지 못했어요.');
    } finally {
      setUploading(false);
    }
  };

  /** 갤러리에서 직접 업로드 */
  const handleGalleryUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel || !result.assets?.[0]) return;

    const asset = result.assets[0];
    if (!asset.uri) return;

    try {
      setUploading(true);
      const { uploadUrl } = await requestProfileImageUpload();
      await uploadMealImage(uploadUrl, {
        uri: asset.uri,
        mimeType: asset.type ?? 'image/jpeg',
      });

      // 업로드 완료 후 서버에서 실제 S3 URL 받아오기
      const user = await getUser();
      dispatch(userSlice.actions.updateProfileImageUrl(user.profileImageUrl));
      handleClose();
    } catch {
      Alert.alert('업로드 실패', '이미지를 업로드하지 못했어요.');
    } finally {
      setUploading(false);
    }
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

          <Pressable
            onPress={handleGalleryUpload}
            style={styles.galleryBtn}
            disabled={uploading}
          >
            <Text style={styles.galleryBtnText}>📷 갤러리에서 선택</Text>
          </Pressable>

          <FlatList
            data={imageList}
            numColumns={3}
            keyExtractor={(item) => item}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => {
              const selected = item === selectedUrl;
              return (
                <Pressable
                  onPress={() => handleAvatarPress(item)}
                  style={[styles.avatarWrapper, selected && styles.selected]}
                >
                  <ProfileAvatar profileImageUrl={item} />
                </Pressable>
              );
            }}
          />

          <View style={styles.footer}>
            <Pressable
              onPress={handleClose}
              style={styles.cancelBtn}
              disabled={uploading}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={styles.saveBtn}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text style={styles.saveText}>저장</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
