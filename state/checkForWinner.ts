import { PlayerId } from './constants';

/**
 * Returns an array of arrays of winning combinations
 * @param boardSize
 * @returns an array of arrays of the square indices in each possible winning combination
 */
const getWinningCombos = (boardSize: number): number[][] => {
    const numSquares = boardSize ** 2;

    const winningCombos: number[][] = [];

    // horizontal winning combos
    let arr: number[] = [];
    for (let index = 0; index <= numSquares; ++index) {
        if (index && index % boardSize === 0) {
            winningCombos.push(arr);
            arr = [];
        }
        arr.push(index);
    }

    // vertical winning combos
    for (let col = 0; col < boardSize; ++col) {
        arr = [];
        winningCombos.push(arr);
        for (let index = col; index < numSquares; index += boardSize) {
            arr.push(index);
        }
    }

    // diagonal winning combos
    const diagonal1: number[] = [];
    const diagonal2: number[] = [];
    winningCombos.push(diagonal1);
    winningCombos.push(diagonal2);
    let index1 = 0;
    let index2 = boardSize - 1;
    for (let row = 0; row < boardSize; ++row) {
        diagonal1.push(index1);
        diagonal2.push(index2);
        index1 += boardSize + 1;
        index2 += boardSize - 1;
    }

    return winningCombos;
};

class ComboCache {
    private cache: Map<number, number[][]>;

    constructor() {
        this.cache = new Map<number, number[][]>();
    }

    getWinningCombos(boardSize: number): number[][] {
        let combos = this.cache.get(boardSize);
        if (!combos) {
            console.log('get winning combos for board size', boardSize);
            combos = getWinningCombos(boardSize);
            this.cache.set(boardSize, combos);
        }
        return combos;
    }
}

const comboCache = new ComboCache();

export function getWinningCombinations(boardSize: number): number[][] {
    return comboCache.getWinningCombos(boardSize);
}

export const checkForWinner = (boardSize: number, squares: (PlayerId | null)[]): PlayerId | null => {
    const winningCombos = comboCache.getWinningCombos(boardSize);
    for (let combo of winningCombos) {
        const firstValue = squares[combo[0]];
        if (firstValue === null) {
            continue;
        }
        if (combo.every(i => squares[i] === firstValue)) {
            return firstValue;
        }
    }
    return null;
};
