import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { uploadPhoto } from '@api/uploadPhoto';
import { getUser } from '@api/mainApi';
import { validateImageAsset } from '@utils/imageUtil';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentImageUrl: string;
};

const SECRET_TAP_REQUIRED = 5;
const TAP_TIMEOUT = 2000; // ms

const PROFILE_HISTORY_KEY = 'fitpet:profile:imageHistory';
const MAX_HISTORY = 10;

const loadProfileImageHistory = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const addProfileImageToHistory = async (url: string): Promise<void> => {
  try {
    const current = await loadProfileImageHistory();
    const deduped = [url, ...current.filter((u) => u !== url)];
    await AsyncStorage.setItem(
      PROFILE_HISTORY_KEY,
      JSON.stringify(deduped.slice(0, MAX_HISTORY))
    );
  } catch {
    // 이력 저장 실패는 무시
  }
};

export default function ProfileImageModal({
  visible,
  onClose,
  currentImageUrl,
}: Props) {
  const dispatch = useDispatch();
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<string[]>([]);
  const [pendingAsset, setPendingAsset] = useState<{
    uri: string;
    type?: string;
  } | null>(null);

  /** 이스터에그 상태 */
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);

  /** 모달 열릴 때 초기화 및 이력 로드 */
  useEffect(() => {
    if (visible) {
      setSelectedUrl(currentImageUrl);
      setTapCount(0);
      setLastTapTime(null);
      loadProfileImageHistory().then(setUploadHistory);
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

  /** 갤러리에서 사진 선택 → 확인 모달 표시 */
  const handleGalleryUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel || !result.assets?.[0]) return;

    const asset = result.assets[0];
    if (!asset.uri) return;

    const validationError = validateImageAsset(asset, 'profile');
    if (validationError) {
      Alert.alert(validationError.title, validationError.message);
      return;
    }

    setPendingAsset({ uri: asset.uri, type: asset.type });
  };

  /** 확인 모달에서 "사용하기" → 실제 업로드 */
  const handleConfirmUpload = async () => {
    if (!pendingAsset) return;

    try {
      setUploading(true);
      const { uploadUrl } = await requestProfileImageUpload();
      await uploadPhoto(uploadUrl, {
        uri: pendingAsset.uri,
        mimeType: pendingAsset.type ?? 'image/jpeg',
      });

      const user = await getUser();
      dispatch(userSlice.actions.updateProfileImageUrl(user.profileImageUrl));
      await addProfileImageToHistory(user.profileImageUrl);
      setPendingAsset(null);
      handleClose();
    } catch {
      Alert.alert('업로드 실패', '이미지를 업로드하지 못했어요.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    <Modal
      visible={!!pendingAsset}
      transparent
      animationType='fade'
      onRequestClose={() => setPendingAsset(null)}
    >
      <View style={styles.confirmBackdrop}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmTitle}>이 사진으로 설정할까요?</Text>
          {pendingAsset && (
            <Image
              source={{ uri: pendingAsset.uri }}
              style={styles.confirmPreview}
              resizeMode='cover'
            />
          )}
          <View style={styles.footer}>
            <Pressable
              onPress={() => setPendingAsset(null)}
              style={styles.cancelBtn}
              disabled={uploading}
            >
              <Text style={styles.cancelText}>다시 선택</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirmUpload}
              style={styles.saveBtn}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text style={styles.saveText}>사용하기</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>

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

          {uploadHistory.length > 0 && (
            <View>
              <Text style={styles.sectionLabel}>내 사진</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.historyScroll}
              >
                {uploadHistory.map((url) => {
                  const selected = url === selectedUrl;
                  return (
                    <Pressable
                      key={url}
                      onPress={() => setSelectedUrl(url)}
                      style={[styles.avatarWrapper, selected && styles.selected]}
                    >
                      <ProfileAvatar profileImageUrl={url} />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <Text style={styles.sectionLabel}>기본 프로필</Text>
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
    </>
  );
}
