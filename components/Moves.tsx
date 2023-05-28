import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../state/game';
import { playerColors } from '../state/constants';

export default function Moves() {
    const moves = useGameStore(state => state.moves);

    return (
        <View>
            <View style={styles.moves}>
                {moves.map(({ squareIndex, playerId }: { squareIndex: number; playerId: number }, i: number) => (
                    <View key={i} style={[styles.circle, { backgroundColor: playerColors[playerId] }]}>
                        <Text style={styles.text}>{squareIndex}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const radius = 35;

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff'
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
    text: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: '#fff'
    }
});
