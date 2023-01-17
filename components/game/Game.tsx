import React from 'react';
import { StyleSheet, View } from 'react-native';
import Board from './board';
import Moves from './moves';
import BoardSizeSelector from './boardSizeSelector';
import Winner from './winner';
import { Actions } from './actions';

function Spacer() {
    return <View style={styles.spacer} />;
}

export default function Game() {
    return (
        <View style={styles.game}>
            <View>
                <BoardSizeSelector />
                <Spacer />
                <Winner />
                <Spacer />
                <Board />
                <Spacer />
                <Actions />
                <Spacer />
                <Moves />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    game: { padding: 10 },
    spacer: {
        height: 10
    }
});
