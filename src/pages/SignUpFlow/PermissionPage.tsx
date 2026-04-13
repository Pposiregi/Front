import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

/**
 * 약관 동의 단계에서 사용할 props.
 */
type PermissionProps = {
  onNext: (data: {
    permissions: {
      serviceAgree: boolean;
      locationAgree: boolean;
      privacyAgree: boolean;
      healthAgree: boolean;
      pushAgree: boolean;
    };
  }) => void;
};

/**
 * 약관 동의 화면.
 * - 필수 동의가 완료되면 다음 단계로 진행한다.
 */
const PermissionPage: React.FC<PermissionProps> = ({ onNext }) => {
  const [serviceAgree, setServiceAgree] = useState(false);
  const [locationAgree, setLocationAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [healthAgree, setHealthAgree] = useState(false);
  const [pushAgree, setPushAgree] = useState(false);

  // 개별 state에서 파생 — 별도 state로 관리하면 동기화 불일치 발생
  const agreeAll = serviceAgree && locationAgree && privacyAgree && healthAgree && pushAgree;

  const handleAgreeAll = () => {
    const next = !agreeAll;
    setServiceAgree(next);
    setLocationAgree(next);
    setPrivacyAgree(next);
    setHealthAgree(next);
    setPushAgree(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        FitPet과 함께 귀여운 여행을 위한 {'\n'}약관에 대해 안내할게요!
      </Text>
      <Text style={styles.subtitle}>
        아래 약관에 <Text style={{ color: 'red' }}>동의</Text>하시면 시작됩니다.
      </Text>
      {/* 전체 동의 */}
      <Pressable style={styles.checkboxContainer} onPress={handleAgreeAll}>
        <CheckBox value={agreeAll} onValueChange={undefined} />
        <Text style={styles.checkboxLabel}>전체 동의</Text>
      </Pressable>
      {/* 개별 동의 항목 */}
      <Pressable
        style={styles.checkboxContainer}
        onPress={() => setServiceAgree((v) => !v)}
      >
        <CheckBox value={serviceAgree} onValueChange={undefined} />
        <Text style={styles.checkboxLabel}>서비스 이용약관 동의(필수)</Text>
      </Pressable>
      <Pressable
        style={styles.checkboxContainer}
        onPress={() => setPrivacyAgree((v) => !v)}
      >
        <CheckBox value={privacyAgree} onValueChange={undefined} />
        <Text style={styles.checkboxLabel}>개인정보 수집이용 동의(필수)</Text>
      </Pressable>
      <Pressable
        style={styles.checkboxContainer}
        onPress={() => setLocationAgree((v) => !v)}
      >
        <CheckBox value={locationAgree} onValueChange={undefined} />
        <Text style={styles.checkboxLabel}>
          위치 기반 서비스 약관 동의(필수)
        </Text>
      </Pressable>
      <Pressable
        style={styles.checkboxContainer}
        onPress={() => setHealthAgree((v) => !v)}
      >
        <CheckBox value={healthAgree} onValueChange={undefined} />
        <Text style={styles.checkboxLabel}>
          건강정보(민감정보) 수집·이용 동의(필수)
        </Text>
      </Pressable>
      <Pressable
        style={styles.checkboxContainer}
        onPress={() => setPushAgree((v) => !v)}
      >
        <CheckBox value={pushAgree} onValueChange={undefined} />
        <Text style={styles.checkboxLabel}>푸시 알림 수신(마케팅) 동의(선택)</Text>
      </Pressable>
      <View style={{ alignItems: 'center' }}>
        <Pressable
          style={[
            styles.startButton,
            !(serviceAgree && locationAgree && privacyAgree && healthAgree) && { backgroundColor: '#ccc' },
          ]}
          disabled={!(serviceAgree && locationAgree && privacyAgree && healthAgree)}
          onPress={() =>
            onNext({
              permissions: {
                serviceAgree,
                locationAgree,
                privacyAgree,
                healthAgree,
                pushAgree,
              },
            })
          }
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PermissionPage;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: height * 0.07,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'JUA',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'thin',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'JUA',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Roboto-VariableFont',
  },
  startButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    marginTop: 50,
    alignItems: 'center',
    width: 150,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
