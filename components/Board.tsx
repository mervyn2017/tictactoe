import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Square from './Square';
import { border } from '../utils/cssUtils';
import { Grid } from './Grid';
import { useGameStore } from '../state/game';
import { playerColors } from '../state/constants';

export default function Board() {
    const boardSize = useGameStore(state => state.boardSize);
    const winner = useGameStore(state => state.winner);
    const gameOver = useGameStore(state => state.gameOver);

    const getElement = (index: number) => <Square key={index} squareIndex={index} />;

    const isDraw = !winner && gameOver;

    return (
        <View style={styles.container}>
            <View style={styles.board}>
                <Grid size={boardSize} getElement={getElement} />
            </View>
            <View style={styles.winnerContainer}>
                {winner && (
                    <>
                        <Text style={styles.winner}>Winner:</Text>
                        <Text style={[styles.winner, { color: playerColors[winner] }]}>{`Player ${winner}`}</Text>
                    </>
                )}
                {isDraw && <Text style={styles.winner}>Draw!</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    board: {
        ...border(4, '#999', 20),
        padding: 2,
        backgroundColor: '#fff',
        alignSelf: 'flex-start'
    },
    winnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    winner: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'yellow'
    }
});
