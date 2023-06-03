import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, GestureResponderEvent } from 'react-native';
import { Button } from 'react-native-paper';
import { randomIntegerArray } from '../utils/statistics';
import { createDelay } from '../utils/delay';
import { useGameStore, Difficulty } from '../state/game';
import { SwitchWithText } from './SwitchWithText';
import * as Haptics from 'expo-haptics';

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
        <Button style={styles.button} compact mode="elevated" onPress={pressed} textColor="#000" buttonColor="#fff">
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
        cancelSimulation();
        setPlayComputer(val);
    };

    useEffect(() => {
        cancelSimulation();
    }, [boardSize]);

    const redoDisabled = !canRedo();
    const undoDisabled = moves.length === 0;

    return (
        <View>
            <View style={styles.container}>
                <ActionButton onPress={startGame}>Play</ActionButton>
                <Spacer />
                <ActionButton onPress={runDemo}>Demo</ActionButton>
                <Spacer />
                {undoDisabled ? <InvisibleBtn /> : <ActionButton onPress={undo}>Undo</ActionButton>}
                <Spacer />
                {redoDisabled ? <InvisibleBtn /> : <ActionButton onPress={redo}>Redo</ActionButton>}
            </View>
            <View style={[styles.container, styles.switchContainer]}>
                <SwitchWithText
                    style={{ flex: 3 }}
                    inactiveText="Two Players"
                    activeText="Play Computer"
                    value={playComputer}
                    onChange={val => setPlayAgainstComputer(val)}
                />
                {playComputer ? (
                    <SwitchWithText
                        style={{ flex: 2 }}
                        inactiveText="Easy"
                        activeText="Difficult"
                        value={difficulty !== Difficulty.Easy}
                        onChange={val => {
                            cancelSimulation();
                            setDifficulty(val ? Difficulty.Difficult : Difficulty.Easy);
                        }}
                    />
                ) : null}
            </View>
        </View>
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
        flex: 1
    },
    spacer: {
        flex: 0.1
    },
    buttonText: {
        fontSize: 16,
        color: '#000'
    }
});
