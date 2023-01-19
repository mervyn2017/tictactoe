import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Square from './square';
import { border } from '../../utils/cssUtils';
import { Grid } from './grid';
import { useGameStore } from '../../state/game/gameState';
import { shallow } from 'zustand/shallow';

export default function Board() {
    const [boardSize, initialize] = useGameStore(state => [state.boardSize, state.initialize], shallow);

    useEffect(() => {
        initialize();
    }, [boardSize, initialize]);

    const getElement = (index: number) => <Square key={index} squareIndex={index} />;

    return (
        <View style={styles.board}>
            <Grid size={boardSize} getElement={getElement} />
        </View>
    );
}

const styles = StyleSheet.create({
    board: {
        ...border(4, '#999', 20),
        padding: 2,
        backgroundColor: '#fff',
        alignSelf: 'flex-start'
    }
});
