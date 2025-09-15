import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import SignUp from './SignUp';
import SignUp2 from './SignUp2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp3 from './SignUp3';
import { useAppDispatch } from '../../store';
import userSlice from '../../slices/user';

const Index = () => {
  //현재 페이지 주소 나타냄
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // 뒤로가기 동작 막음
    const backAction = () => {
      return true;
    };
    // 안드로이드 하드웨어 뒤로가기도 막음
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const startSignUpInProgress = async () => {
      try {
        await AsyncStorage.setItem('isSignUpInProgress', 'true');
        dispatch(userSlice.actions.setSignUpInProgress(true));
      } catch (err) {
        console.error('회원가입 상태 저장 실패', err);
      }
    };
    startSignUpInProgress();
  }, [dispatch]);

  // 각 페이지에서 버튼 눌렀을 때 호출 다음페이지로
  const goToNextPage = () => {
    const totalPages = 3;
    if (pagerRef.current && currentPage < totalPages - 1) {
      pagerRef.current.setPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={(styles.text, { color: '#666666' })}>
          환영합니다! FietPet이 처음이신가요?
        </Text>
      </View>

      <View style={styles.dotContainer}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.dot, currentPage === i && styles.activeDot]}
          />
        ))}
      </View>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        ref={pagerRef}
      >
        <SignUp key='1' onNext={goToNextPage} />
        <SignUp2 key='2' onNext={goToNextPage} />
        <SignUp3 key='3' />
      </PagerView>
    </View>
  );
};

export default Index;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pagerView: { flex: 1 },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'JUA',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.03,
    marginBottom: 5,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6347',
  },
});
