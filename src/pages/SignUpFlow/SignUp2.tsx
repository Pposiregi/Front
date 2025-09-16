import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  containsBannedWord,
  isValidDate,
  isValidHeight,
  isValidNickname,
  isValidWeight,
} from '../../utils/validation';

type SignUp2Props = {
  onNext: (data: {
    nickName: string;
    birth: {
      year: string;
      month: string;
      day: string;
    };
    gender: 'male' | 'female';
    weight: string;
    height: string;
  }) => void;
};

const SignUp2: React.FC<SignUp2Props> = ({ onNext }) => {
  const [nickName, setNickName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const nameRef = useRef<TextInput | null>(null);
  const yearRef = useRef<TextInput | null>(null);
  const monthRef = useRef<TextInput | null>(null);
  const dayRef = useRef<TextInput | null>(null);
  const weightRef = useRef<TextInput | null>(null);
  const heightref = useRef<TextInput | null>(null);

  const onChangeNickName = useCallback((text: string) => {
    setNickName(text.trim());
  }, []);
  const onChangeYear = useCallback((text: string) => {
    setYear(text.trim());
  }, []);
  const onChangeMonth = useCallback((text: string) => {
    setMonth(text.trim());
  }, []);
  const onChangeDay = useCallback((text: string) => {
    setDay(text.trim());
  }, []);
  const onChangeWeight = useCallback((text: string) => {
    setWeight(text.trim());
  }, []);
  const onChangeHeight = useCallback((text: string) => {
    setHeight(text.trim());
  }, []);
  const onSubmit = useCallback(() => {
    if (!nickName || !nickName.trim())
      return Alert.alert('알림', '닉네임을 입력해주세요.');
    if (!year || !year.trim())
      return Alert.alert('알림', '출생 연도를 입력해주세요.');
    if (!month || !month.trim())
      return Alert.alert('알림', '출생 월을 입력해주세요.');
    if (!day || !day.trim())
      return Alert.alert('알림', '출생 일을 입력해주세요.');
    if (!gender) return Alert.alert('알림', '성별을 선택해주세요.');
    if (!weight || !weight.trim())
      return Alert.alert('알림', '몸무게를 입력해주세요.');
    if (!height || !height.trim())
      return Alert.alert('알림', '키를 입력해주세요.');

    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return Alert.alert('알림', '생년월일을 올바르게 입력해주세요.');
    }

    // 생년월일 검증
    const birthCheck = isValidDate(y, m, d);
    if (!birthCheck.valid) {
      return Alert.alert('알림', birthCheck.message);
    }

    // 닉네임 검증
    if (!isValidNickname(nickName)) {
      return Alert.alert(
        '알림',
        containsBannedWord(nickName)
          ? '닉네임에 부적절한 단어가 포함되어 있습니다.'
          : '닉네임은 2~10자, 한글/영어/숫자만 사용 가능합니다.'
      );
    }

    // 몸무게 검증
    if (!isValidWeight(weight)) {
      return Alert.alert('알림', '올바른 체중을 입력해주세요.');
    }

    // 몸무게 검증
    if (!isValidHeight(height)) {
      return Alert.alert('알림', '올바른 키를 입력해주세요.');
    }
    // 모든 체크 통과
    onNext({
      nickName,
      birth: {
        year,
        month,
        day,
      },
      gender,
      weight,
      height,
    });
  }, [nickName, year, month, day, gender, weight, height]);

  const canGoNext =
    nickName && year && month && day && gender && weight && height;
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true} // 입력창이 키보드에 가려지지 않게 설정
      extraScrollHeight={100} // 키보드와의 간격 확보 이거 없으면 딱 붙어서 스크롤이 안된다..
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>사용자님을 더 잘 알고 싶어요!</Text>
          <Text style={styles.subtitle}>
            함께할 준비가 되셨다면, 간단한 정보를 {'\n'}알려주세요.
          </Text>
          <Text style={styles.requiredInfo}>
            * 표시가 있는 항목은 필수 입력입니다.
          </Text>
          <Text style={styles.label}>
            닉네임<Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeNickName}
            placeholder='사용할 닉네임을 입력하세요.'
            placeholderTextColor='#666'
            ref={nameRef}
            onSubmitEditing={() => yearRef.current?.focus()}
          ></TextInput>
          <Text style={styles.label}>
            생년월일<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInputBirth}
              onChangeText={onChangeYear}
              placeholder='YYYY'
              placeholderTextColor='#666'
              ref={yearRef}
              onSubmitEditing={() => monthRef.current?.focus()}
              keyboardType='number-pad'
              maxLength={4}
            ></TextInput>
            <TextInput
              style={styles.textInputBirth}
              onChangeText={onChangeMonth}
              placeholder='MM'
              placeholderTextColor='#666'
              ref={monthRef}
              onSubmitEditing={() => dayRef.current?.focus()}
              keyboardType='number-pad'
              maxLength={2}
            ></TextInput>
            <TextInput
              style={styles.textInputBirth}
              onChangeText={onChangeDay}
              placeholder='DD'
              placeholderTextColor='#666'
              ref={dayRef}
              keyboardType='number-pad'
              maxLength={2}
            ></TextInput>
          </View>
          <Text style={styles.label}>
            성별<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.optionContainer}>
            {/* 남성 */}
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => setGender('male')}
            >
              <View style={styles.radioOuter}>
                {gender === 'male' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.gender_label}>남성</Text>
            </TouchableOpacity>

            {/* 여성 */}
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => setGender('female')}
            >
              <View style={styles.radioOuter}>
                {gender === 'female' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.gender_label}>여성</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>
            신체정보<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.weightContainer}>
            <TextInput
              style={styles.weightInput}
              onChangeText={onChangeWeight}
              placeholder='체중 입력'
              placeholderTextColor='#666'
              keyboardType='number-pad'
              ref={weightRef}
              maxLength={3}
              onSubmitEditing={() => heightref.current?.focus()}
            />
            <Text style={styles.unit}>kg</Text>
            <TextInput
              style={styles.weightInput}
              onChangeText={onChangeHeight}
              placeholder='키 입력'
              placeholderTextColor='#666'
              keyboardType='number-pad'
              maxLength={3}
              ref={heightref}
            />
            <Text style={styles.unit}>cm</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Pressable
              style={[
                styles.startButton,
                !canGoNext && { backgroundColor: '#ccc' },
              ]}
              disabled={!canGoNext}
              onPress={onSubmit}
            >
              <Text style={styles.startButtonText}>시작하기</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default SignUp2;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop: -height * 0.02,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 10,
    fontFamily: 'JUA',
    marginTop: height * 0.07,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'thin',
    marginBottom: 10,
    fontFamily: 'JUA',
  },
  requiredInfo: {
    fontSize: 14,
    color: '#FF6347',
    marginBottom: height * 0.04,
    fontFamily: 'JUA',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'JUA',
    marginLeft: 4,
  },
  required: {
    color: 'red',
  },
  textInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: height * 0.03,
    fontSize: 16,
  },
  textInputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.08,
  },
  textInputBirth: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 30,
    width: width * 0.18,
    textAlign: 'center',
    fontSize: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  gender_label: {
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    marginTop: height * 0.05,
    alignItems: 'center',
    width: width * 0.4,
    marginBottom: height * 0.1,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  weightContainer: {
    flexDirection: 'row',
    borderColor: '#ccc',
    marginBottom: 30,
    height: height * 0.06, // 높이 고정
  },
  weightInput: {
    flex: 1,
    height: '100%',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  unit: {
    fontSize: 20,
    marginLeft: 5,
    height: '100%',
    textAlignVertical: 'center',
  },
});
