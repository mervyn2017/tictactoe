import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../state/game';
import { playerColors } from '../state/constants';

export default function Moves() {
    const moves = useGameStore(state => state.moves);

    return (
        <View style={styles.moves}>
            {moves.map(({ squareIndex, playerId }: { squareIndex: number; playerId: number }, i: number) => (
                <View key={i} style={[styles.move, { backgroundColor: playerColors[playerId] }]}>
                    <Text style={styles.text}>{squareIndex}</Text>
                </View>
            ))}
        </View>
    );
}

const radius = 30;

const styles = StyleSheet.create({
    moves: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    move: {
        height: radius,
        width: radius,
        borderRadius: 8,
        margin: 2,
        borderWidth: 1,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: '#fff'
    }
});
