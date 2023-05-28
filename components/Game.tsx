import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Actions } from './Actions';
import Board from './Board';
import Moves from './Moves';
import BoardSizeSelector from './BoardSizeSelector';

function Spacer() {
    return <View style={styles.spacer} />;
}

export default function Game() {
    return (
        <View style={styles.game}>
            <BoardSizeSelector />
            <Spacer />
            <Actions />
            <Spacer />
            <Board />
            <Spacer />
            <Moves />
        </View>
    );
}

const styles = StyleSheet.create({
    game: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5
    },
    spacer: {
        height: 20
    }
});
