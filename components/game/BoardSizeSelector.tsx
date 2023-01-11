import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useGameStore } from '../../state/game/gameState';

const sizeOptions = [
    { label: '3 x 3', value: '3' },
    { label: '4 x 4', value: '4' },
    { label: '5 x 5', value: '5' },
    { label: '6 x 6', value: '6' }
];

export default function BoardSizeSelector() {
    const [boardSize, setBoardSize] = useGameStore(state => [state.boardSize, state.setBoardSize]);

    const [value, setValue] = React.useState(boardSize + '');

    const onChangeBoardSize = (val: string) => {
        setBoardSize(+val);
        setValue(val);
    };

    return (
        <View>
            <SafeAreaView>
                <SegmentedButtons
                    value={value}
                    onValueChange={onChangeBoardSize}
                    buttons={sizeOptions}
                    density="regular"
                />
            </SafeAreaView>
        </View>
    );
}
