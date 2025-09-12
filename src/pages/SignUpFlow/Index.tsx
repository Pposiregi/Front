import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import SignUp from './SignUp';
import SignUp2 from './SignUp2';

const Index = () => {
  useEffect(() => {
    const backAction = () => {
      // 뒤로가기 동작 막음
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={(styles.text, { color: '#666666' })}>
          환영합니다! FietPet이 처음이신가요?
        </Text>
      </View>

      <View style={styles.dotContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.dot, currentPage === i && styles.activeDot]}
          />
        ))}
      </View>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <SignUp key='1' />
        <SignUp2 key='2' />
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
  pagerView: { flex: 0.9 },
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
    marginBottom: 10,
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
