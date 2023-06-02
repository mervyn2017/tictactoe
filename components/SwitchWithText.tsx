import { Platform, StyleSheet, View, Text, Switch } from 'react-native';

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
    return (
        <View style={[styles.container, style]}>
            <Switch
                trackColor={{ false: '#fff', true: '#fff' }}
                thumbColor={value ? '#06f' : '#090'}
                ios_backgroundColor="#fff"
                onValueChange={() => onChange(!value)}
                value={value}
            />
            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.text}>
                    {value ? activeText : inactiveText}
                </Text>
            </View>
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