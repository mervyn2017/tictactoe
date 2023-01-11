/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { type PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Button } from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions
} from 'react-native/Libraries/NewAppScreen';

import { MD3LightTheme as DefaultTheme, Provider as PaperProvider, Appbar, Menu } from 'react-native-paper';
import { NavigationContainer, ParamListBase, Route } from '@react-navigation/native';
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions,
    NativeStackNavigationProp
} from '@react-navigation/native-stack';
import Game from './components/game/Game';
import Users from './components/users/users';

const Stack = createNativeStackNavigator();

const Section: React.FC<
    PropsWithChildren<{
        title: string;
    }>
> = ({ children, title }) => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black
                    }
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark
                    }
                ]}>
                {children}
            </Text>
        </View>
    );
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow'
    }
};

function HomeScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
    };
    return (
        <View>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                {/* <Header /> */}
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white
                    }}>
                    <Section title="See Your Changes">
                        <ReloadInstructions />
                    </Section>
                    <Section title="Debug">
                        <DebugInstructions />
                    </Section>
                </View>
            </ScrollView>
        </View>
    );
}

type CustomNavigationBarProps = {
    navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
    back?: { title: string } | undefined;
    options: NativeStackNavigationOptions;
    route: Route<string, object | undefined>;
};

function CustomNavigationBar({ navigation, back, options }: CustomNavigationBarProps) {
    console.log(options.title);
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const navigateTo = (name: string) => {
        navigation.navigate(name);
        setVisible(false);
    };

    return (
        <Appbar.Header style={styles.appBarHeader}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={options.title} />
            {!back ? (
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon="menu" color="#000" onPress={openMenu} />}>
                    <Menu.Item onPress={() => navigateTo('Game')} title="Tic Tac Toe" />
                    <Menu.Item onPress={() => navigateTo('Users')} title="Users" />
                </Menu>
            ) : null}
        </Appbar.Header>
    );
}

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        // <SafeAreaView style={backgroundStyle}>
        <PaperProvider theme={theme}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
            />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        header: props => <CustomNavigationBar {...props} />
                    }}>
                    <Stack.Screen name="Home" options={{ title: 'React Debugging' }} component={HomeScreen} />
                    <Stack.Screen name="Game" options={{ title: 'Tic Tac Toe' }} component={Game} />
                    <Stack.Screen name="Users" options={{ title: 'Users' }} component={Users} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600'
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400'
    },
    highlight: {
        fontWeight: '700'
    },
    appBarHeader: {
        backgroundColor: '#ddf'
    }
});

export default App;
