import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type SignUp3Props = {
  onNext: () => void;
};

function SignUp3() {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true} // 입력창이 키보드에 가려지지 않게 설정
      extraScrollHeight={100} // 키보드와의 간격 확보 이거 없으면 딱 붙어서 스크롤이 안된다..
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>사용자님을 더 잘 알고 싶어요!</Text>
          <Text style={styles.subtitle}>
            함께할 준비가 되셨다면, 간단한 정보를 알려주세요.
          </Text>
          <Text style={styles.label}>닉네임</Text>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

export default SignUp3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 10,
    fontFamily: 'JUA',
    marginTop: 60,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'thin',
    marginBottom: 30,
    fontFamily: 'JUA',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'JUA',
    marginLeft: 4,
  },
  textInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 30,
    fontSize: 16,
  },
});
