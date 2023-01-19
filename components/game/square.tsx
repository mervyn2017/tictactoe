import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useGameStore } from '../../state/game/gameState';
import { border } from '../../utils/cssUtils';
import { shallow } from 'zustand/shallow';

const getStyle = (value: number | null) => {
    switch (value) {
        case 0:
            return styles.nought;
        case 1:
            return styles.cross;
        default:
            return styles.gridCell;
    }
};

export default function Square(props: { squareIndex: number }) {
    const { squareIndex } = props;
    const [style, setStyle] = useState(getStyle(squareIndex));
    const [value, executeMove] = useGameStore(state => [state.squares[squareIndex], state.executeMove], shallow);

    useEffect(() => setStyle(getStyle(value)), [value, squareIndex]);

    return (
        <Pressable onPressIn={() => executeMove(squareIndex)} style={[style, styles.gridCell]}>
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
    nought: {
        backgroundColor: '#4444ff'
    },
    cross: {
        backgroundColor: '#f00'
    },
    text: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: '#fff'
    }
});
