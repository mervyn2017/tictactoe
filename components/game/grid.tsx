import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    rowStyle: { flexDirection: 'row' }
});

export function Grid({
    size,
    getElement
}: {
    size: number;
    getElement: (index: number, row: number, col: number) => JSX.Element;
}) {
    const arr = [...Array(size)];
    let index = 0;

    return (
        <View>
            {arr.map((e, rowIndex) => (
                <View key={rowIndex} style={styles.rowStyle}>
                    {arr.map((_, colIndex) => (
                        <View key={colIndex}>{getElement(index++, rowIndex, colIndex)}</View>
                    ))}
                </View>
            ))}
        </View>
    );
}
