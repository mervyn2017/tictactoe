import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Alert } from 'react-native';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Game from './components/Game';
import { NativeModules, BackHandler } from 'react-native';
// import Constants from 'expo-constants';

// console.log(Constants.statusBarHeight);

const { StatusBarManager } = NativeModules;

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors
    }
};

export default function App() {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', BackHandler.exitApp);
        return () => backHandler.remove();
    }, []);

    return (
        <PaperProvider theme={theme}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <Game />
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        paddingTop: (Platform.OS === 'android' ? Math.ceil(StatusBarManager.HEIGHT) : 20) + 10
    }
});
