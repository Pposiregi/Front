import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styles } from '@styles/OptionalInfoPage.styles';
import { Colors } from '@styles/theme';
import {
  isValidPbf,
  isValidTargetStep,
  isValidWeight,
} from '../../utils/validation';
import { KeyboardAwareScreen } from '@components/KeyboardAwareScreen';

type OptionalInfoProps = {
  onFinish: (data: {
    targetWeightKg: string;
    pbf: string;
    targetPbf: string;
    targetStepCount: string;
  }) => void;
};
const OptionalInfoPage: React.FC<OptionalInfoProps> = ({ onFinish }) => {
  const [targetWeightKg, setTargetWeight] = useState('');
  const [pbf, setcurrentPbf] = useState('');
  const [targetPbf, setTargetPbf] = useState('');
  const [targetStepCount, setTargetStep] = useState('');
  const targetWeightRef = useRef<TextInput | null>(null);
  const pbfRef = useRef<TextInput | null>(null);
  const targetPbfRef = useRef<TextInput | null>(null);
  const targetWalkRef = useRef<TextInput | null>(null);
  const allEmpty = !targetWeightKg && !pbf && !targetPbf && !targetStepCount;
  // 제출 버튼을 눌렀을 때 실행될 함수
  const onSubmit = useCallback(() => {
    // 모든 값이 비어있을 때 (건너뛰기)
    if (allEmpty) {
      onFinish({ targetWeightKg, pbf, targetPbf, targetStepCount });
      return;
    }

    // 입력된 값이 하나라도 있을 때, 유효성 검사 실행
    if (targetWeightKg && !isValidWeight(targetWeightKg)) {
      Alert.alert('알림', '목표 체중을 올바르게 입력해주세요.');
      return;
    }
    if (pbf && !isValidPbf(pbf)) {
      Alert.alert('알림', '현재 체지방률을 올바르게 입력해주세요.');
      return;
    }
    if (targetPbf && !isValidPbf(targetPbf)) {
      Alert.alert('알림', '목표 체지방률을 올바르게 입력해주세요.');
      return;
    }
    if (targetStepCount && !isValidTargetStep(targetStepCount)) {
      Alert.alert('알림', '목표 걸음을 올바르게 입력해주세요.');
      return;
    }

    // 모든 유효성 검사 통과
    onFinish({ targetWeightKg, pbf, targetPbf, targetStepCount });
  }, [targetWeightKg, pbf, targetPbf, targetStepCount, allEmpty, onFinish]);
  return (
    /*
      목표 체중/걸음/체지방률 입력창은 화면 하단으로 이어지므로 키보드가 올라올 때
      현재 입력값이 보이도록 공통 KeyboardAwareScreen에 스크롤 보정을 위임한다.
    */
    <KeyboardAwareScreen>
      <View style={styles.container}>
        <Text style={styles.title}>함께 도달할 목표를 설정해요</Text>
        <Text style={styles.subtitle}>
          원하는 체중과 체지방률을 입력해주세요. {'\n'}목표를 세우면 여정이
          시작돼요.
        </Text>
        <Text style={styles.requiredInfo}>
          추후 입력 가능합니다. 너무 걱정하지 마세요!
        </Text>
        <Text style={styles.label}>목표 체중</Text>
        <View style={styles.inputWithUnit}>
          <TextInput
            style={styles.textInputFlex}
            placeholder='목표 체중을 입력하세요.'
            placeholderTextColor={Colors.textMuted}
            keyboardType='numeric'
            onChangeText={setTargetWeight}
            ref={targetWeightRef}
            onSubmitEditing={() => targetWalkRef.current?.focus()}
          />
          <Text style={styles.unit}>kg</Text>
        </View>
        <Text style={styles.label}>목표 걸음</Text>
        <View style={styles.inputWithUnit}>
          <TextInput
            style={styles.textInputFlex}
            placeholder='목표 걸음을 입력하세요.'
            placeholderTextColor={Colors.textMuted}
            keyboardType='numeric'
            onChangeText={setTargetStep}
            ref={targetWalkRef}
            onSubmitEditing={() => pbfRef.current?.focus()}
          />
          <Text style={styles.unit}>step</Text>
        </View>
        <Text style={styles.label}>현재 체지방률(pbf)</Text>
        <View style={styles.inputWithUnit}>
          <TextInput
            style={styles.textInputFlex}
            placeholder='현재 체지방률을 입력하세요.'
            placeholderTextColor={Colors.textMuted}
            keyboardType='numeric'
            onChangeText={setcurrentPbf}
            ref={pbfRef}
            onSubmitEditing={() => targetPbfRef.current?.focus()}
          />
          <Text style={styles.unit}>%</Text>
        </View>
        <Text style={styles.label}>목표 체지방률(pbf)</Text>
        <View style={styles.inputWithUnit}>
          <TextInput
            style={styles.textInputFlex}
            placeholder='목표 체지방률을 입력하세요.'
            placeholderTextColor={Colors.textMuted}
            keyboardType='numeric'
            onChangeText={setTargetPbf}
            ref={targetPbfRef}
          />
          <Text style={styles.unit}>%</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Pressable style={[styles.startButton]} onPress={onSubmit}>
            <Text style={styles.startButtonText}>
              {allEmpty ? '건너뛰기' : '시작하기'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScreen>
  );
};

export default OptionalInfoPage;
