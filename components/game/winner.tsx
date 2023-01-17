import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { border, padding } from '../../utils/cssUtils';
import { useGameStore } from '../../state/game/gameState';

export default function Winner() {
    const winner = useGameStore(state => state.winner);

    return (
        <View style={styles.container}>
            <Text style={styles.text} textBreakStrategy="simple">
                Winner: {winner ?? '?'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        ...border(2, '#999', 10),
        ...padding(5, 15),
        backgroundColor: 'rgb(255, 255, 175)'
    },
    text: {
        fontFamily: 'normal',
        fontWeight: 'bold',
        fontSize: 16
    }
});
