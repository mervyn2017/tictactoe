import React, { useEffect } from 'react';
import Square from './square';
import { StyleSheet, View } from 'react-native';
import { border } from '../../utils/cssUtils';
import { Grid } from './grid';
import { useGameStore } from '../../state/game/gameState';

export default function Board() {
    const [boardSize, initialize] = useGameStore(state => [state.boardSize, state.initialize]);

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
