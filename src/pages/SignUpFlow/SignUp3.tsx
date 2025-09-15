import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootStackParamList } from '../../../AppInner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlice from '../../slices/user';
import { useAppDispatch } from '../../store';

function SignUp3() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [weight, setWeight] = useState('');
  const [currentPbf, setcurrentPbf] = useState('');
  const [targetPbf, setTargetPbf] = useState('');
  const allEmpty = !weight && !currentPbf && !targetPbf;
  const dispatch = useAppDispatch();
  const onSubmit = async () => {
    await AsyncStorage.setItem('isSignUpInProgress', 'false');
    dispatch(userSlice.actions.setSignUpInProgress(false));
  };
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
              onChangeText={setWeight}
            />
            <Text style={styles.unit}>kg</Text>
          </View>
          <Text style={styles.label}>현재 체지방률(pbf)</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={styles.textInputFlex}
              placeholder='현재 체지방률을 입력하세요.'
              placeholderTextColor='#666'
              keyboardType='numeric'
              onChangeText={setcurrentPbf}
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
            />
            <Text style={styles.unit}>%</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Pressable
              style={[styles.startButton]}
              onPress={() => {
                if (allEmpty) {
                  // 다 비었을때
                  console.log('건너뛰기');
                  onSubmit();
                } else {
                  // 입력이 한개라도 있을때
                  console.log('제출');
                  onSubmit();
                }
              }}
            >
              <Text style={styles.startButtonText}>
                {allEmpty ? '건너뛰기' : '시작하기'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

export default SignUp3;
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
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'JUA',
    marginLeft: 4,
    marginBottom: 10,
  },
  requiredInfo: {
    fontSize: 14,
    color: '#FF6347',
    marginBottom: height * 0.04,
    fontFamily: 'JUA',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: height * 0.05,
  },
  textInputFlex: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  unit: {
    fontSize: 16,
    marginLeft: 5,
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
});
