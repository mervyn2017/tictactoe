/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider, Appbar, Menu } from 'react-native-paper';
import { NavigationContainer, ParamListBase, Route } from '@react-navigation/native';
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions,
    NativeStackNavigationProp
} from '@react-navigation/native-stack';
import Game from './components/game/Game';
import Users from './components/usersAndProducts/usersAndProductsTabs';
import { DebugScreen } from './components/debugScreen';
import { SignInScreen } from './components/login/signInScreen';
import { useAuthStore } from './state/authStore';

const Stack = createNativeStackNavigator();

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow'
    }
};

type CustomNavigationBarProps = {
    navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
    back?: { title: string } | undefined;
    options: NativeStackNavigationOptions;
    route: Route<string, object | undefined>;
};

function CustomNavigationBar({ navigation, back, options }: CustomNavigationBarProps) {
    const [signedIn, signOut, username] = useAuthStore(state => [state.signedIn, state.signOut, state.username]);

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const navigateTo = (name: string) => {
        navigation.navigate(name);
        setVisible(false);
    };

    const logout = () => {
        signOut();
        setVisible(false);
    };

    return (
        <Appbar.Header style={styles.appBarHeader}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={options.title} />
            {signedIn && !back ? (
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon="menu" color="#000" onPress={openMenu} />}>
                    <Menu.Item onPress={() => navigateTo('UsersAndProducts')} title="Users And Products" />
                    <Menu.Item onPress={() => navigateTo('Debug')} title="Debug" />
                    <Menu.Item onPress={() => logout()} title={`Logout ${username}`} />
                </Menu>
            ) : null}
        </Appbar.Header>
    );
}

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const isSignedIn = useAuthStore(state => state.signedIn);
    return (
        // <SafeAreaView style={backgroundStyle}>
        <PaperProvider theme={theme}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
            />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Game"
                    screenOptions={{
                        header: props => <CustomNavigationBar {...props} />
                    }}>
                    {isSignedIn ? (
                        <>
                            <Stack.Screen name="Game" options={{ title: 'Tic Tac Toe' }} component={Game} />
                            <Stack.Screen
                                name="UsersAndProducts"
                                options={{ title: 'Users And Products' }}
                                component={Users}
                            />
                            <Stack.Screen name="Debug" options={{ title: 'React Debugging' }} component={DebugScreen} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="SignIn" options={{ title: 'Sign In' }} component={SignInScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    appBarHeader: {
        backgroundColor: '#ddf'
    }
});

export default App;
