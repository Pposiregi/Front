import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { logout as kakaoLogout } from '@react-native-seoul/kakao-login';
import styles from '@styles/ProfileSettings.styles';
import { useAppDispatch } from '@store/index';
import type { RootState } from '@store/reducer';
import userSlice from '@slices/user';
import { ProfileStackNavigationProp } from '@navigation/profileStack';
import { updatePetProfile, updateUserProfile } from '@api/profileApi';
import { saveBodyGoals } from '@utils/bodyGoalsStorage';
import { deletePushToken } from '@api/pushTokenApi';
import { getDeviceUuid } from '@utils/deviceUuid';
import { clearLastSentPushToken } from '@utils/pushTokenStorage';
import type { PetType } from 'types/profile';
import { getResolvedPetId } from '@utils/petIdStorage';
import { isValidNickname } from '@utils/validation';
import { PET_TYPE_STORAGE_KEY } from '@shared/config/petConfig';

const PET_ID_FALLBACK = 1;

type SettingRowProps = {
  label: string;
  onPress: () => void;
  muted?: boolean;
};

/** 설정 화면에서 공통으로 사용하는 한 줄짜리 메뉴 행 UI다. */
const SettingRow = ({ label, onPress, muted }: SettingRowProps) => (
  <Pressable style={styles.row} onPress={onPress}>
    <Text style={[styles.rowLabel, muted && styles.rowMuted]}>{label}</Text>
    <Text style={styles.arrow}>{muted ? '' : '>'}</Text>
  </Pressable>
);

/** 프로필 설정, 펫 설정, 로그아웃 진입점을 제공하는 화면이다. */
const ProfileSettingPage = () => {
  const navigation =
    useNavigation<ProfileStackNavigationProp<'ProfileSettings'>>();
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [petNameInput, setPetNameInput] = useState('');
  const [petType, setPetType] = useState<PetType>('DOG');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [savingPet, setSavingPet] = useState(false);
  const [bodyGoalModalVisible, setBodyGoalModalVisible] = useState(false);
  const [targetWeightInput, setTargetWeightInput] = useState('');
  const [targetPbfInput, setTargetPbfInput] = useState('');
  const [petId, setPetId] = useState(PET_ID_FALLBACK);
  const currentPetType = useSelector((state: RootState) => state.user.petType);

  useEffect(() => {
    let mounted = true;
    getResolvedPetId(PET_ID_FALLBACK, '>>> [ProfileSettings]').then(
      (resolved) => {
        if (mounted) {
          setPetId(resolved);
        }
      }
    );
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPetType(currentPetType);
  }, [currentPetType]);

  useEffect(() => {
    AsyncStorage.getItem(PET_TYPE_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'DOG' || stored === 'CAT') {
          // 로컬 캐시는 모달 초기값 hydrate 용도만 맡긴다.
          // Redux 전역 상태는 서버 응답을 source of truth로 유지한다.
          setPetType(stored);
        }
      })
      .catch((error) => {
        console.warn('>>> [ProfileSettings] petType 로드 실패', error);
      });
  }, []);

  /** 플랫폼 로그아웃과 푸시 토큰 정리를 포함한 전체 로그아웃 플로우를 수행한다. */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (accessToken) {
        try {
          const deviceUuid = await getDeviceUuid();
          if (!deviceUuid) {
            console.warn('>>> [FCM][PushToken] deviceUuid 없음, DELETE 스킵');
          } else {
            console.log('>>> [FCM][PushToken] DELETE /devices/push-token', {
              deviceUuid,
            });

            // DB, Storage 초기화
            await deletePushToken({ deviceUuid }, accessToken);
            await clearLastSentPushToken();
          }
        } catch (err) {
          console.error('>>> [FCM][PushToken] DELETE 실패', err);
        }
      } else {
        console.warn('>>> [FCM][PushToken] accessToken 없음, DELETE 스킵');
      }

      const platform = await AsyncStorage.getItem('platform');
      if (platform === 'google') {
        await GoogleSignin.signOut();
      } else if (platform === 'kakao') {
        await kakaoLogout();
      }

      await EncryptedStorage.removeItem('refreshToken');
      await AsyncStorage.multiRemove([
        'platform',
        'isSignUpInProgress',
        PET_TYPE_STORAGE_KEY,
      ]);
      dispatch(userSlice.actions.resetUser());
      Alert.alert('로그아웃 완료', '다음에 다시 만나요!');
    } catch (err) {
      console.error('logout err', err);
      Alert.alert('로그아웃 실패', '네트워크를 확인한 뒤 다시 시도해주세요.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  /** 탈퇴 대체 안내 모달을 연다. */
  const handleWithdraw = () => {
    setWithdrawModalVisible(true);
  };

  /** 현재는 탈퇴 대신 로그아웃으로 대체되는 안내 플로우를 실행한다. */
  const confirmWithdraw = async () => {
    setWithdrawModalVisible(false);
    Alert.alert(
      '회원탈퇴 안내',
      '탈퇴 플로우는 백엔드 연동 후 적용됩니다.\n현재는 로그아웃으로 대체됩니다.'
    );
    await handleLogout();
  };

  // 닉네임 변경 시 redux 업데이트
  const nickname = useSelector((state: RootState) => state.user.nickname);
  // 닉네임 창 열면 기존 닉네임 기본 설정 되어 있도록 설정
  useEffect(() => {
    if (nicknameModalVisible) {
      setNicknameInput(nickname ?? '');
    }
  }, [nicknameModalVisible, nickname]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Text style={styles.backText}>{'<'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>설정</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.section}>
          <SettingRow
            label='계정설정'
            onPress={() => setNicknameModalVisible(true)}
          />
          <SettingRow
            label='내 몸 목표 수정'
            onPress={() => setBodyGoalModalVisible(true)}
          />
          <SettingRow
            label='내 펫 설정'
            onPress={() => setPetModalVisible(true)}
          />
        </View>

        <View style={styles.section}>
          <SettingRow
            label='알림설정'
            onPress={() =>
              Alert.alert('알림설정', '푸시/리마인드 설정은 곧 제공됩니다.')
            }
          />
          <SettingRow
            label='공지사항'
            onPress={() =>
              Alert.alert('공지사항', '공지 리스트 화면이 연결될 예정입니다.')
            }
          />
          <SettingRow
            label='약관 및 정책'
            onPress={() =>
              Alert.alert('약관 및 정책', '약관/정책 웹뷰를 연결해둘게요.')
            }
          />
          <SettingRow label='현재버전 1.0.0' muted onPress={() => {}} />
        </View>

        <View style={styles.actionArea}>
          <Pressable
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <Text style={styles.logoutText}>
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.withdrawButton]}
            onPress={handleWithdraw}
            disabled={isLoggingOut}
          >
            <Text style={styles.withdrawText}>회원탈퇴</Text>
          </Pressable>
        </View>

        <View style={styles.footerIconRow}>
          <Text style={styles.footerIcon}>💪</Text>
          <Text style={styles.footerIcon}>🐶</Text>
        </View>
      </ScrollView>

      <Modal
        visible={withdrawModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>회원탈퇴 안내</Text>
            <Text style={styles.modalBody}>
              실제 탈퇴 처리는 백엔드 연동 후 제공됩니다. 지금은 로그아웃으로
              대체돼요.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setWithdrawModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={confirmWithdraw}
              >
                <Text style={styles.modalConfirmText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 닉네임 수정 모달 */}
      <Modal
        visible={nicknameModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setNicknameModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>닉네임 수정</Text>
            <Text style={styles.modalBody}>
              새 닉네임을 입력하세요. (2~20자)
            </Text>
            <TextInput
              style={styles.input}
              placeholder='닉네임'
              value={nicknameInput}
              onChangeText={setNicknameInput}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setNicknameModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalConfirm,
                  savingProfile && styles.buttonDisabled,
                ]}
                disabled={savingProfile}
                onPress={async () => {
                  const newNickname = nicknameInput.trim();
                  if (!isValidNickname(newNickname)) {
                    Alert.alert(
                      '닉네임 오류',
                      '닉네임은 2~10자의 한글, 영문, 숫자만 가능하며 비속어는 사용할 수 없어요.'
                    );
                    return;
                  }
                  setSavingProfile(true);
                  try {
                    await updateUserProfile({
                      nickname: newNickname,
                    });
                    dispatch(userSlice.actions.updateNickname(newNickname));
                    Alert.alert('완료', '닉네임이 변경되었습니다.');
                    setNicknameModalVisible(false);
                  } catch (err) {
                    console.error('[Profile] 닉네임 수정 실패', err);
                    Alert.alert('실패', '닉네임을 수정하지 못했습니다.');
                  } finally {
                    setSavingProfile(false);
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>
                  {savingProfile ? '저장 중...' : '저장'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 내 몸 목표 수정 모달 */}
      <Modal
        visible={bodyGoalModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setBodyGoalModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>내 몸 목표 수정</Text>
            <Text style={styles.modalBody}>
              목표 체중(kg)과 체지방률(%)을 입력하세요.
            </Text>
            <TextInput
              style={styles.input}
              placeholder='목표 체중 (kg)'
              keyboardType='decimal-pad'
              value={targetWeightInput}
              onChangeText={setTargetWeightInput}
            />
            <TextInput
              style={styles.input}
              placeholder='목표 체지방률 (%)'
              keyboardType='decimal-pad'
              value={targetPbfInput}
              onChangeText={setTargetPbfInput}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setBodyGoalModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalConfirm,
                  savingGoal && styles.buttonDisabled,
                ]}
                disabled={savingGoal}
                onPress={async () => {
                  const weight = Number(targetWeightInput);
                  const pbf = Number(targetPbfInput);

                  if (!targetWeightInput.trim() || Number.isNaN(weight)) {
                    Alert.alert(
                      '입력 오류',
                      '목표 체중을 올바르게 입력하세요.'
                    );
                    return;
                  }
                  if (!targetPbfInput.trim() || Number.isNaN(pbf)) {
                    Alert.alert(
                      '입력 오류',
                      '목표 체지방률을 올바르게 입력하세요.'
                    );
                    return;
                  }

                  setSavingGoal(true);
                  try {
                    // 서버 프로필 업데이트 후 로컬 목표값도 캐싱해 화면에서 즉시 사용
                    await updateUserProfile({
                      targetWeightKg: weight,
                      targetPbf: pbf,
                    });
                    await saveBodyGoals({
                      weightAim: weight,
                      bodyFatAim: pbf,
                    });
                    Alert.alert('완료', '내 몸 목표가 수정되었습니다.');
                    setBodyGoalModalVisible(false);
                    setTargetWeightInput('');
                    setTargetPbfInput('');
                  } catch (err) {
                    console.error('[Profile] 몸 목표 수정 실패', err);
                    Alert.alert('실패', '몸 목표를 수정하지 못했습니다.');
                  } finally {
                    setSavingGoal(false);
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>
                  {savingGoal ? '저장 중...' : '저장'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 펫 정보 수정 모달 */}
      <Modal
        visible={petModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setPetModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>펫 정보 수정</Text>
            <Text style={styles.modalBody}>이름과 종류를 변경합니다.</Text>
            <TextInput
              style={styles.input}
              placeholder='펫 이름'
              value={petNameInput}
              onChangeText={setPetNameInput}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              {(['DOG', 'CAT'] as PetType[]).map((type) => (
                <Pressable
                  key={type}
                  style={[styles.chip, petType === type && styles.chipSelected]}
                  onPress={() => setPetType(type)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      petType === type && styles.chipTextSelected,
                    ]}
                  >
                    {type === 'DOG' ? '강아지' : '고양이'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setPetModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalConfirm,
                  savingPet && styles.buttonDisabled,
                ]}
                disabled={savingPet}
                onPress={async () => {
                  if (!petNameInput.trim()) {
                    Alert.alert('입력 오류', '펫 이름을 입력하세요.');
                    return;
                  }
                  setSavingPet(true);
                  try {
                    await updatePetProfile(petId, {
                      name: petNameInput.trim(),
                      petType,
                    });
                    dispatch(userSlice.actions.updatePetType(petType));
                    try {
                      // 서버 상태 반영 이후의 캐시 저장 실패는 보조 저장소 문제이므로
                      // 사용자에게 전체 실패로 보이지 않게 분리한다.
                      await AsyncStorage.setItem(PET_TYPE_STORAGE_KEY, petType);
                    } catch (storageError) {
                      console.warn(
                        '>>> [ProfileSettings] petType 캐시 저장 실패',
                        storageError
                      );
                    }
                    Alert.alert('완료', '펫 정보가 변경되었습니다.');
                    setPetModalVisible(false);
                  } catch (err) {
                    console.error('[Profile] 펫 정보 수정 실패', err);
                    Alert.alert('실패', '펫 정보를 수정하지 못했습니다.');
                  } finally {
                    setSavingPet(false);
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>
                  {savingPet ? '저장 중...' : '저장'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileSettingPage;
