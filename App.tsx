/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { MainScreen } from '@pages/main/MainPage'; // alias 적용된 import
function App() {
    const isDarkMode = useColorScheme() === 'dark';
    useEffect(() => {
        SplashScreen.hide();
    }, []);
    return (
        <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <MainScreen />
        </SafeAreaProvider>
    );
}


export default App;
