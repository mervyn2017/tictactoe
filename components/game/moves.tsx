import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../../state/game/gameState';
import { shallow } from 'zustand/shallow';

export default function Moves() {
    const moves = useGameStore(state => state.moves, shallow);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Moves</Text>
            <View style={styles.moves}>
                {moves.map(({ squareIndex, playerId }: { squareIndex: number; playerId: number }, i: number) => (
                    <View key={i} style={[styles.circle, playerId === 0 ? styles.player1 : styles.player2]}>
                        <Text style={styles.text}>{squareIndex}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const radius = 35;

const styles = StyleSheet.create({
    container: {},
    label: {
        marginBottom: 5,
        fontFamily: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'green'
    },
    moves: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    circle: {
        height: radius,
        width: radius,
        borderRadius: 8,
        margin: 1,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    player1: { backgroundColor: '#4444ff' },
    player2: { backgroundColor: '#f00' },
    text: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: '#fff'
    }
});
