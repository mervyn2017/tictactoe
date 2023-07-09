import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useGameStore } from '../state/game';
import { border } from '../utils/cssUtils';
import { shallow } from 'zustand/shallow';
import { calculateNextMove } from '../state/engine';
import { playerColors } from '../state/constants';
import * as Haptics from 'expo-haptics';

const cellSize = {
    3: 70,
    4: 55,
    5: 45
};

export default function Square(props: { squareIndex: number }) {
    const { squareIndex } = props;
    const playComputer = useGameStore(state => state.playComputer);
    const gameOver = useGameStore(state => state.gameOver);
    const moves = useGameStore(state => state.moves);
    const boardSize = useGameStore(state => state.boardSize);
    const [value, executeMove] = useGameStore(state => [state.squares[squareIndex], state.executeMove], shallow);

    const onPress = () => {
        if (gameOver) {
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const hasWinner = executeMove(squareIndex);
        if (!hasWinner && playComputer && moves.length < boardSize ** 2 - 1) {
            executeMove(calculateNextMove());
        }
    };

    const bckColor = value === null ? {} : { backgroundColor: playerColors[value] };
    const cellSizeCss = {
        width: cellSize[boardSize],
        height: cellSize[boardSize]
    };

    return (
        <Pressable onPressIn={onPress} style={[bckColor, styles.gridCell, cellSizeCss]}>
            <Text style={styles.text}>{squareIndex}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    gridCell: {
        ...border(1, '#000', 100),
        margin: 2,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: '#fff'
    }
});
