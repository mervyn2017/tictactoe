import React, { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

function Section({ children, title }: PropsWithChildren<{ title: string }>) {
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
}

export function DebugScreen() {
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
    }
});
