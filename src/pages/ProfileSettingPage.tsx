import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { logout as kakaoLogout } from '@react-native-seoul/kakao-login';
import styles from '@styles/ProfileSettings.styles';
import { useAppDispatch } from '@store/index';
import userSlice from '@slices/user';
import { ProfileStackNavigationProp } from '@navigation/profileStack';

type SettingRowProps = {
  label: string;
  onPress: () => void;
  muted?: boolean;
};

const SettingRow = ({ label, onPress, muted }: SettingRowProps) => (
  <Pressable style={styles.row} onPress={onPress}>
    <Text style={[styles.rowLabel, muted && styles.rowMuted]}>{label}</Text>
    <Text style={styles.arrow}>{muted ? '' : '>'}</Text>
  </Pressable>
);

const ProfileSettingPage = () => {
  const navigation =
    useNavigation<ProfileStackNavigationProp<'ProfileSettings'>>();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const commonNotice = useMemo(
    () =>
      'OAuth 로그인은 비밀번호 변경이 불가능해요. 계정 보안은 각 플랫폼(구글/카카오)에서 진행해주세요.',
    []
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const platform = await AsyncStorage.getItem('platform');
      if (platform === 'google') {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } else if (platform === 'kakao') {
        await kakaoLogout();
      }

      await EncryptedStorage.removeItem('refreshToken');
      await AsyncStorage.multiRemove(['platform', 'isSignUpInProgress']);
      dispatch(userSlice.actions.resetUser());
      Alert.alert('로그아웃 완료', '다음에 다시 만나요!');
    } catch (err) {
      console.error('logout err', err);
      Alert.alert('로그아웃 실패', '네트워크를 확인한 뒤 다시 시도해주세요.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleWithdraw = () => {
    setWithdrawModalVisible(true);
  };

  const confirmWithdraw = async () => {
    setWithdrawModalVisible(false);
    Alert.alert(
      '회원탈퇴 안내',
      '탈퇴 플로우는 백엔드 연동 후 적용됩니다.\n현재는 로그아웃으로 대체됩니다.'
    );
    await handleLogout();
  };

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
            onPress={() => Alert.alert('계정설정', commonNotice)}
          />
          <SettingRow
            label='내 몸 목표 수정'
            onPress={() =>
              Alert.alert('내 몸 목표 수정', '다음 배포에서 목표 수정 화면을 연결합니다.')
            }
          />
          <SettingRow
            label='내 펫 설정'
            onPress={() => Alert.alert('내 펫 설정', '펫 정보 변경 화면 준비 중입니다.')}
          />
        </View>

        <View style={styles.section}>
          <SettingRow
            label='알림설정'
            onPress={() => Alert.alert('알림설정', '푸시/리마인드 설정은 곧 제공됩니다.')}
          />
          <SettingRow
            label='공지사항'
            onPress={() => Alert.alert('공지사항', '공지 리스트 화면이 연결될 예정입니다.')}
          />
          <SettingRow
            label='약관 및 정책'
            onPress={() => Alert.alert('약관 및 정책', '약관/정책 웹뷰를 연결해둘게요.')}
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
    </View>
  );
};

export default ProfileSettingPage;
