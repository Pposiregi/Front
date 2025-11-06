import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { HealthConnectRequirement } from '@hooks/useHealthConnectPrompt';

// 헬스 커넥트 필수 요구 컴포넌트 Props 타입
type HealthConnectRequiredProps = {
  requirement: HealthConnectRequirement;
  onRetry: () => void;
  onOpenStore: () => void;
  isChecking: boolean;
};

// 요구에 따른 메시지 반환 함수
const requirementMessage = (requirement: HealthConnectRequirement) => {
  if (requirement === 'update') {
    return '최신 Health Connect 앱이 필요합니다. 업데이트 후 다시 확인해주세요.';
  }
  return 'Health Connect 앱 설치가 필요합니다. 설치 후 다시 확인해주세요.';
};

// 헬스 커넥트 필수 요구 컴포넌트
const HealthConnectRequired = ({
  requirement,
  onRetry,
  onOpenStore,
  isChecking,
}: HealthConnectRequiredProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Connect 연동 필요</Text>
      <Text style={styles.description}>{requirementMessage(requirement)}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={onOpenStore}>
          <Text style={styles.primaryLabel}>GoogleStore 이동</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={onRetry}
          disabled={isChecking}
        >
          {isChecking ? (
            <ActivityIndicator size='small' color='#333333' />
          ) : (
            <Text style={styles.secondaryLabel}>다시 확인</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.footer}>
        설치 후 이 화면으로 돌아오면 정상 설치 여부를 확인할게요!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#444444',
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    borderRadius: 12,
  },
  secondaryLabel: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
  },
});

export default HealthConnectRequired;
