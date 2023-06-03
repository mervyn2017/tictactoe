import { Platform, StyleSheet, View, Text, Switch, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

export function SwitchWithText({
    value,
    onChange,
    activeText,
    inactiveText,
    style = {}
}: {
    value: boolean;
    onChange: (value: boolean) => void;
    activeText: string;
    inactiveText: string;
    style?: {};
}) {
    const toggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChange(!value);
    };

    return (
        <View style={[styles.container, style]}>
            <Switch
                trackColor={{ false: '#fff', true: '#fff' }}
                thumbColor={value ? '#06f' : '#090'}
                ios_backgroundColor="#fff"
                onValueChange={toggle}
                value={value}
            />
            <Pressable style={styles.textContainer} onPress={toggle}>
                <Text numberOfLines={1} style={styles.text}>
                    {value ? activeText : inactiveText}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textContainer: {
        marginLeft: Platform.OS === 'ios' ? 10 : 4,
        flex: 1
    },
    text: {
        color: '#fff',
        fontSize: 16
    }
});
