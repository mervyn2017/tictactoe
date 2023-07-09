import React from 'react';
import { SafeAreaView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useGameStore } from '../state/game';
import * as Haptics from 'expo-haptics';

const checkedColor = '#00ff44';
const uncheckedColor = '#999';

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
        <SafeAreaView>
            <SegmentedButtons
                value={`${boardSize}`}
                onValueChange={boardSizeSelected}
                buttons={sizeOptions}
                density="regular"
                theme={{ colors: { secondaryContainer: '#000' } }}
            />
        </SafeAreaView>
    );
}
