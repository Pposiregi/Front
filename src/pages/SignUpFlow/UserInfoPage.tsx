import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '@styles/UserInfoPage.styles';
import {
  containsBannedWord,
  isValidDate,
  isValidHeight,
  isValidNickname,
  isValidWeight,
} from '../../utils/validation';
import { KeyboardAwareScreen } from '@components/KeyboardAwareScreen';

type UserInfoProps = {
  onNext: (data: {
    nickName: string;
    birth: {
      year: string;
      month: string;
      day: string;
    };
    gender: 'male' | 'female';
    weightKg: string;
    heightCm: string;
  }) => void;
};

const UserInfoPage: React.FC<UserInfoProps> = ({ onNext }) => {
  const [nickName, setNickName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [weightKg, setWeight] = useState('');
  const [heightCm, setHeight] = useState('');
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
    if (text.trim().length === 4) monthRef.current?.focus();
  }, []);
  const onChangeMonth = useCallback((text: string) => {
    setMonth(text.trim());
    if (text.trim().length === 2) dayRef.current?.focus();
  }, []);
  const onChangeDay = useCallback((text: string) => {
    setDay(text.trim());
  }, []);
  const onChangeWeight = useCallback((text: string) => {
    setWeight(text.trim());
    if (text.trim().length === 3) heightref.current?.focus();
  }, []);
  const onChangeHeight = useCallback((text: string) => {
    setHeight(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (!nickName || !nickName.trim())
      return Alert.alert('알림', '닉네임을 입력해주세요.');
    if (!year || !year.trim())
      return Alert.alert('알림', '출생 연도를 입력해주세요.');
    if (!month || !month.trim())
      return Alert.alert('알림', '출생 월을 입력해주세요.');
    if (!day || !day.trim())
      return Alert.alert('알림', '출생 일을 입력해주세요.');
    if (!gender) return Alert.alert('알림', '성별을 선택해주세요.');
    if (!weightKg || !weightKg.trim())
      return Alert.alert('알림', '몸무게를 입력해주세요.');
    if (!heightCm || !heightCm.trim())
      return Alert.alert('알림', '키를 입력해주세요.');

    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

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
    if (!isValidWeight(weightKg)) {
      return Alert.alert('알림', '올바른 체중을 입력해주세요.');
    }

    // 키 검증
    if (!isValidHeight(heightCm)) {
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
      weightKg,
      heightCm,
    });
  }, [nickName, year, month, day, gender, weightKg, heightCm, onNext]);

  const canGoNext =
    nickName && year && month && day && gender && weightKg && heightCm;
  return (
    /*
      키보드 대응은 공통 KeyboardAwareScreen에서 처리한다.
      이 화면은 하단의 체중/키 입력창이 숫자 키보드에 가려지기 쉬우므로,
      별도 ScrollView를 중첩하지 않고 공통 래퍼가 직접 스크롤 위치를 계산하게 둔다.
    */
    <KeyboardAwareScreen>
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
          returnKeyType='next'
          onSubmitEditing={() => yearRef.current?.focus()}
        />
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
          />
          <TextInput
            style={styles.textInputBirth}
            onChangeText={onChangeMonth}
            placeholder='MM'
            placeholderTextColor='#666'
            ref={monthRef}
            onSubmitEditing={() => dayRef.current?.focus()}
            keyboardType='number-pad'
            maxLength={2}
          />
          <TextInput
            style={styles.textInputBirth}
            onChangeText={onChangeDay}
            placeholder='DD'
            placeholderTextColor='#666'
            ref={dayRef}
            keyboardType='number-pad'
            maxLength={2}
          />
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

        <View style={styles.buttonWrapper}>
          <Pressable
            style={[
              styles.startButton,
              !canGoNext && styles.startButtonDisabled,
            ]}
            disabled={!canGoNext}
            onPress={onSubmit}
          >
            <Text style={styles.startButtonText}>시작하기</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScreen>
  );
};

export default UserInfoPage;
