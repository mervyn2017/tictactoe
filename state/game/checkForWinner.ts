const getWinningCombos = (boardSize: number): number[][] => {
    const numSquares = Math.pow(boardSize, 2);

    const winningCombos = [];
    let arr: Array<number> = [];
    for (let index = 0; index <= numSquares; ++index) {
        if (index && index % boardSize === 0) {
            winningCombos.push(arr);
            arr = [];
        }
        arr.push(index);
    }

    for (let col = 0; col < boardSize; ++col) {
        arr = [];
        winningCombos.push(arr);
        for (let index = col; index < numSquares; index += boardSize) {
            arr.push(index);
        }
    }

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

export const checkForWinner = (boardSize: number, squares: (number | null)[]): string | undefined => {
    const winningCombos = getWinningCombos(boardSize);
    for (let combo of winningCombos) {
        const firstValue = squares[combo[0]];
        if (firstValue === null) {
            continue;
        }
        if (combo.every(i => squares[i] === firstValue)) {
            const winner = firstValue === 0 ? 'Player 1' : 'Player 2';
            return winner;
        }
    }
    return undefined;
};
