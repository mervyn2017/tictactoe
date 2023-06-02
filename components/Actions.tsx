import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, GestureResponderEvent } from 'react-native';
import { Button } from 'react-native-paper';
import { randomIntegerArray } from '../utils/statistics';
import { createDelay } from '../utils/delay';
import { useGameStore, Difficulty } from '../state/game';
import { padding } from '../utils/cssUtils';
import { SwitchWithText } from './SwitchWithText';

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
            compact
            mode="elevated"
            onPress={onPress}
            disabled={disabled}
            textColor="#000"
            buttonColor="#fff">
            <Text style={styles.buttonText}>{children}</Text>
        </Button>
    );
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

    const resetGame = () => {
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
            resetGame();
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
                <ActionButton onPress={resetGame}>Play</ActionButton>
                <ActionButton onPress={runDemo}>Demo</ActionButton>
                <ActionButton onPress={undo} disabled={undoDisabled}>
                    Undo
                </ActionButton>
                <ActionButton onPress={redo} disabled={redoDisabled}>
                    Redo
                </ActionButton>
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
        marginRight: 10,
        ...padding(0, 4)
    },
    buttonText: {
        fontSize: 16
    }
});
