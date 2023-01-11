import React from 'react';
import { StyleSheet, View } from 'react-native';
import Board from './Board';
import Moves from './Moves';
import BoardSizeSelector from './BoardSizeSelector';
import Winner from './Winner';
import { Actions } from './Actions';

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
