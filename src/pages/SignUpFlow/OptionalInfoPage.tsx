import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styles } from '@styles/OptionalInfoPage.styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  isValidPbf,
  isValidTargetStep,
  isValidWeight,
} from '../../utils/validation';

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
    <KeyboardAwareScrollView
      enableOnAndroid={true} // 입력창이 키보드에 가려지지 않게 설정
      extraScrollHeight={100} // 키보드와의 간격 확보 이거 없으면 딱 붙어서 스크롤이 안된다..
    >
      <ScrollView>
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
              placeholderTextColor='#666'
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
              placeholderTextColor='#666'
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
              placeholderTextColor='#666'
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
              placeholderTextColor='#666'
              keyboardType='numeric'
              onChangeText={setTargetPbf}
              ref={targetPbfRef}
            />
            <Text style={styles.unit}>%</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Pressable style={[styles.startButton]} onPress={onSubmit}>
              <Text style={styles.startButtonText}>
                {allEmpty ? '건너뛰기' : '시작하기'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default OptionalInfoPage;
