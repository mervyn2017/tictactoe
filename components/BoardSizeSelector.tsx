import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useGameStore } from '../state/game';
import * as Haptics from 'expo-haptics';

const checkedColor = 'black';
const uncheckedColor = 'white';

const sizeOptions = [
    { label: '3 x 3', value: '3', checkedColor, uncheckedColor },
    { label: '4 x 4', value: '4', checkedColor, uncheckedColor },
    { label: '5 x 5', value: '5', checkedColor, uncheckedColor }
];

export default function BoardSizeSelector() {
    const boardSize = useGameStore(state => state.boardSize);
    const setBoardSize = useGameStore(state => state.setBoardSize);

    const boardSizeSelected = (size: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setBoardSize(+size);
    };

    return (
        <View>
            <SafeAreaView>
                <SegmentedButtons
                    value={`${boardSize}`}
                    onValueChange={boardSizeSelected}
                    buttons={sizeOptions}
                    density="regular"
                    theme={{
                        colors: {
                            secondaryContainer: 'cyan'
                        }
                    }}
                />
            </SafeAreaView>
        </View>
    );
}
