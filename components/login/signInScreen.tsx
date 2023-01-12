import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useAuthStore } from '../../state/authStore';
import { margin } from '../../utils/cssUtils';

export function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const signIn = useAuthStore(state => state.signIn);

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.textInput}
                    activeUnderlineColor="#666"
                />
            </View>
            <View style={styles.input}>
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.textInput}
                    activeUnderlineColor="#666"
                    secureTextEntry
                />
            </View>
            <View style={styles.button}>
                <Button
                    mode="contained"
                    onPress={() => signIn({ username, password })}
                    disabled={!username || !password}
                    buttonColor="navy">
                    Sign in
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#bfb',
        flex: 1
    },
    input: {
        ...margin(30, 20, 0, 20)
    },
    button: {
        marginTop: 50,
        alignSelf: 'center'
    },
    textInput: {
        backgroundColor: '#fff'
    }
});
