import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  requestProfileImageUpload,
  updateUserProfile,
  getProfileImageHistory,
} from '@api/profileApi';
import { uploadPhoto } from '@api/uploadPhoto';
import { getUser } from '@api/mainApi';
import { validateImageAsset } from '@utils/imageUtil';
import type { ProfileImageHistoryItem } from 'types/profile';
import { Colors } from '@styles/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentImageUrl: string;
};

const SECRET_TAP_REQUIRED = 5;
const TAP_TIMEOUT = 2000;

const extractImageKey = (imageUrlOrKey: string): string => {
  try {
    const url = new URL(imageUrlOrKey);
    return url.pathname.replace(/^\/+/, '');
  } catch {
    return imageUrlOrKey;
  }
};

export default function ProfileImageModal({
  visible,
  onClose,
  currentImageUrl,
}: Props) {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState(() =>
    extractImageKey(currentImageUrl)
  );
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<ProfileImageHistoryItem[]>(
    []
  );
  const [pendingAsset, setPendingAsset] = useState<{
    uri: string;
    type?: string;
  } | null>(null);

  const historyRefreshingRef = useRef(false);

  /** 이스터에그 상태 */
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedKey(extractImageKey(currentImageUrl));
      setTapCount(0);
      setLastTapTime(null);
      getProfileImageHistory()
        .then((history) => {
          console.log('[ProfileImage] 이력 조회 성공:', history.length, '개');
          setUploadHistory(history);
          const current = history.find((item) => item.isCurrent);
          if (current) {
            setSelectedKey(current.imageKey);
          }
        })
        .catch((e) => {
          console.warn('[ProfileImage] 이력 조회 실패:', e);
        });
    }
  }, [visible, currentImageUrl]);

  const imageList = useMemo(() => {
    return secretUnlocked
      ? [...PROFILE_PRESET_URLS, ...SECRET_PRESET_URLS]
      : PROFILE_PRESET_URLS;
  }, [secretUnlocked]);

  const handleAvatarPress = (url: string) => {
    const key = extractImageKey(url);
    setSelectedKey(key);

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

  const handleSave = async () => {
    try {
      setUploading(true);
      await updateUserProfile({ profileImageKey: selectedKey });
      const history = await getProfileImageHistory();
      const current = history.find((item) => item.isCurrent);
      if (current) {
        dispatch(userSlice.actions.updateProfileImageUrl(current.presignedUrl));
      }
      handleClose();
    } catch (e) {
      console.warn('[ProfileImage] 저장 실패:', e);
      Alert.alert('저장 실패', '프로필 이미지를 저장하지 못했어요.');
    } finally {
      setUploading(false);
    }
  };

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

  const handleConfirmUpload = async () => {
    if (!pendingAsset) return;

    try {
      setUploading(true);
      console.log('[ProfileImage] 갤러리 업로드 시작');
      const { uploadUrl } = await requestProfileImageUpload();
      await uploadPhoto(uploadUrl, {
        uri: pendingAsset.uri,
        mimeType: pendingAsset.type ?? 'image/jpeg',
      });
      console.log('[ProfileImage] S3 업로드 성공');
      const user = await getUser();
      dispatch(userSlice.actions.updateProfileImageUrl(user.profileImageUrl));
      setPendingAsset(null);
      handleClose();
    } catch (e) {
      console.warn('[ProfileImage] 업로드 실패:', e);
      Alert.alert('업로드 실패', '이미지를 업로드하지 못했어요.');
    } finally {
      setUploading(false);
    }
  };

  const handleHistorySelect = (item: ProfileImageHistoryItem) => {
    setSelectedKey(item.imageKey);
  };

  const handleHistoryImageError = async () => {
    if (historyRefreshingRef.current) return;
    console.log('[ProfileImage] 이력 이미지 로드 실패 → presigned URL 재조회');
    historyRefreshingRef.current = true;
    try {
      const history = await getProfileImageHistory();
      console.log('[ProfileImage] 이력 재조회 성공:', history.length, '개');
      setUploadHistory(history);
    } catch (e) {
      console.warn('[ProfileImage] 이력 재조회 실패:', e);
    } finally {
      historyRefreshingRef.current = false;
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
                  <ActivityIndicator color={Colors.surface} />
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
                  {uploadHistory.map((item) => {
                    const selected = item.imageKey === selectedKey;
                    return (
                      <Pressable
                        key={item.imageKey}
                        onPress={() => handleHistorySelect(item)}
                        style={[
                          styles.avatarWrapper,
                          selected && styles.selected,
                        ]}
                      >
                        <Image
                          source={{ uri: item.presignedUrl }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode='cover'
                          onError={handleHistoryImageError}
                        />
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
                const selected = extractImageKey(item) === selectedKey;
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
                  <ActivityIndicator color={Colors.surface} />
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
