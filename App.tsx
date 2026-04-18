import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '@styles/theme';

function App() {
  return (
    //useSelector 사용 위해 Provider로 감싼 후 AppInner.tsx로 이동
    <SafeAreaView style={styles.container} edges={['top']}>
      <Provider store={store}>
        <AppInner />
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.background,
  },
});

export default App;
