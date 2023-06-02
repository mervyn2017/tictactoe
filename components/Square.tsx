import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useGameStore, Difficulty } from '../state/game';
import { border } from '../utils/cssUtils';
import { shallow } from 'zustand/shallow';
import { getPlayerTwoMoveRandom, getPlayerTwoMoveOptimal } from '../state/engine';
import { playerColors } from '../state/constants';
import * as Haptics from 'expo-haptics';

export default function Square(props: { squareIndex: number }) {
    const { squareIndex } = props;
    const playComputer = useGameStore(state => state.playComputer);
    const gameOver = useGameStore(state => state.gameOver);
    const [value, executeMove] = useGameStore(state => [state.squares[squareIndex], state.executeMove], shallow);
    const difficulty = useGameStore(state => state.difficulty);

    const onPress = () => {
        if (gameOver) {
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const hasWinner = executeMove(squareIndex);
        if (!hasWinner && playComputer) {
            if (difficulty === Difficulty.Easy) {
                executeMove(getPlayerTwoMoveRandom());
            } else {
                executeMove(getPlayerTwoMoveOptimal());
            }
        }
    };

    const bckColor = value === null ? {} : { backgroundColor: playerColors[value] };

    return (
        <Pressable onPressIn={onPress} style={[bckColor, styles.gridCell]}>
            <Text style={styles.text}>{squareIndex}</Text>
        </Pressable>
    );
}

const cellSize = 40;

const styles = StyleSheet.create({
    gridCell: {
        height: cellSize,
        width: cellSize,
        ...border(1, '#000', cellSize),
        margin: 1,
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
