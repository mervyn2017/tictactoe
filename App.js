import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Game from './components/Game';
import { NativeModules } from 'react-native';
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
        backgroundColor: '#222',
        paddingTop: (Platform.OS === 'android' ? Math.ceil(StatusBarManager.HEIGHT) : 20) + 10
    }
});
