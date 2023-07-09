import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, GestureResponderEvent, SafeAreaView } from 'react-native';
import { Button, SegmentedButtons } from 'react-native-paper';
import { randomIntegerArray } from '../utils/statistics';
import { createDelay } from '../utils/delay';
import { useGameStore, Difficulty } from '../state/game';
import * as Haptics from 'expo-haptics';

const PlayOptions = [
    { label: 'Play Computer', value: '1', checkedColor: '#00ff44', uncheckedColor: '#999' },
    { label: 'Two Player', value: '0', checkedColor: '#00ff44', uncheckedColor: '#999' }
];

const DifficultyOptions = [
    { label: 'Easy', value: Difficulty.Easy, checkedColor: '#00ff44', uncheckedColor: '#999' },
    { label: 'Medium', value: Difficulty.Medium, checkedColor: '#00ff44', uncheckedColor: '#999' },
    { label: 'Difficult', value: Difficulty.Difficult, checkedColor: '#00ff44', uncheckedColor: '#999' }
];

type ActionButtonProps = {
    onPress: (e: GestureResponderEvent) => void;
    children: any;
};

function ActionButton({ onPress, children }: ActionButtonProps) {
    const pressed = (e: GestureResponderEvent) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(e);
    };

    return (
        <Button style={styles.button} compact mode="outlined" onPress={pressed} buttonColor="#ddd">
            <Text style={styles.buttonText}>{children}</Text>
        </Button>
    );
}

function InvisibleBtn() {
    return <View style={styles.button}></View>;
}

function Spacer() {
    return <View style={styles.spacer}></View>;
}

export function Actions() {
    const reset = useGameStore(state => state.reset);
    const canRedo = useGameStore(state => state.canRedo);
    const undoLastMove = useGameStore(state => state.undoLastMove);
    const redoMove = useGameStore(state => state.redoMove);
    const moves = useGameStore(state => state.moves);
    const boardSize = useGameStore(state => state.boardSize);
    const numSquares = useGameStore(state => state.squares.length);
    const executeMove = useGameStore(state => state.executeMove);

    const difficulty = useGameStore(state => state.difficulty);
    const setDifficulty = useGameStore(state => state.setDifficulty);

    const playComputer = useGameStore(state => state.playComputer);
    const setPlayComputer = useGameStore(state => state.setPlayComputer);

    const [cancelSimulation, setCancelSimulation] = useState(() => () => {});

    const startGame = () => {
        cancelSimulation();
        reset();
    };

    const undo = () => {
        cancelSimulation();
        undoLastMove();
    };

    const redo = () => {
        cancelSimulation();
        redoMove();
    };

    const runDemo = () => {
        cancelSimulation();
        setCancelSimulation(() => {
            // starts the simulation and returns the cancel function
            reset();
            const randomArray = randomIntegerArray(numSquares);
            let cancel = false;
            (async () => {
                for (let squareIndex of randomArray) {
                    if (cancel || executeMove(squareIndex)) {
                        break;
                    }
                    await createDelay(40);
                }
            })();
            return () => (cancel = true);
        });
    };

    const setPlayAgainstComputer = (val: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        cancelSimulation();
        setPlayComputer(val);
    };

    useEffect(() => {
        cancelSimulation();
    }, [boardSize]);

    const redoDisabled = !canRedo();
    const undoDisabled = moves.length === 0;

    return (
        <SafeAreaView>
            <View>
                <SegmentedButtons
                    value={playComputer ? '1' : '0'}
                    onValueChange={val => setPlayAgainstComputer(val === '1' ? true : false)}
                    buttons={PlayOptions}
                    density="small"
                    theme={{ colors: { secondaryContainer: '#000' } }}
                />
            </View>
            {playComputer ? (
                <View style={[styles.container, styles.switchContainer]}>
                    <SegmentedButtons
                        value={difficulty}
                        onValueChange={val => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            cancelSimulation();
                            setDifficulty(val);
                        }}
                        buttons={DifficultyOptions}
                        density="small"
                        theme={{ colors: { secondaryContainer: '#000' } }}
                    />
                </View>
            ) : null}
            <View style={[styles.container, styles.switchContainer]}>
                <ActionButton onPress={startGame}>Reset</ActionButton>
                <Spacer />
                {undoDisabled ? <InvisibleBtn /> : <ActionButton onPress={undo}>Undo</ActionButton>}
                <Spacer />
                {redoDisabled ? <InvisibleBtn /> : <ActionButton onPress={redo}>Redo</ActionButton>}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    switchContainer: {
        marginTop: 15
    },
    button: {
        flex: 1,
        borderColor: '#000'
    },
    spacer: {
        flex: 0.2
    },
    buttonText: {
        fontSize: 16,
        color: '#000'
    }
});
