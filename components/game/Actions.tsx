import React from 'react';
import { StyleSheet, Text, View, GestureResponderEvent } from 'react-native';
import { Button } from 'react-native-paper';
import { randomIntegerArray } from '../../utils/statistics';
import { createDelay } from '../../utils/delay';
import { useGameStore } from '../../state/game/gameState';
import { padding } from '../../utils/cssUtils';

const reset = () => {
    useGameStore.getState().initialize();
};

const undo = () => {
    useGameStore.getState().undoLastMove();
};

const redo = () => {
    useGameStore.getState().redoMove();
};

const simulate = async () => {
    const gameState = useGameStore.getState();
    const randomArray = randomIntegerArray(gameState.squares.length);
    reset();
    for (let squareIndex of randomArray) {
        if (gameState.executeMove(squareIndex)) {
            break;
        }
        await createDelay(40);
    }
};

function ActionButton({
    onPress,
    children,
    disabled
}: {
    onPress: (e: GestureResponderEvent) => void;
    children: any;
    disabled?: boolean;
}) {
    return (
        <Button
            style={styles.button}
            mode="elevated"
            compact
            onPress={onPress}
            disabled={disabled}
            textColor="#000"
            buttonColor="rgb(131, 255, 131)">
            <Text style={styles.buttonText}>{children}</Text>
        </Button>
    );
}

export function Actions() {
    const [moves, canRedo] = useGameStore(state => [state.moves, state.canRedo]);

    const redoDisabled = !canRedo();
    const undoDisabled = moves.length === 0;

    return (
        <View style={styles.buttonsContainer}>
            <ActionButton onPress={reset}>Reset</ActionButton>
            <ActionButton onPress={undo} disabled={undoDisabled}>
                Undo
            </ActionButton>
            <ActionButton onPress={redo} disabled={redoDisabled}>
                Redo
            </ActionButton>
            <ActionButton onPress={simulate}>Simulate</ActionButton>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    button: {
        marginRight: 10,
        ...padding(0, 5)
    },
    buttonText: {
        fontSize: 16
    }
});
