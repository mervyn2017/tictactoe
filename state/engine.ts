import { useGameStore, Difficulty } from './game';
import { getWinningCombinations } from './checkForWinner';
import { PlayerId } from './constants';
import { getOptimalMove } from './optimalEngine';

/**
 * Returns the index of the square of the next move for the given player
 * @param squares
 */
function getRandomMove(): number {
    const squares = useGameStore.getState().squares;
    const nullSquares = [];
    squares.forEach((square, index) => {
        if (square === null) {
            nullSquares.push(index);
        }
    });
    const r = Math.floor(Math.random() * nullSquares.length);
    return nullSquares[r];
}

/**
 * Return an immediate winning move if available
 * else return a move that blocks an immediate win by the other player if they have one
 * else return a random move
 * @param boardSize
 * @param playerToMove
 * @param squares
 * @returns
 */
function getBestMoveLookingOneMoveAhead(boardSize: number, playerToMove: PlayerId, squares: (number | null)[]) {
    const winningCombos = getWinningCombinations(boardSize);
    // look for any combination which has (boardSize-1) of the same player
    const opposingPlayer = playerToMove === PlayerId.One ? PlayerId.Two : PlayerId.One;
    let opponentWinningSquare: number | undefined;
    for (const combo of winningCombos) {
        const counts = {
            [PlayerId.One]: 0,
            [PlayerId.Two]: 0
        };
        for (let i = 0; i < boardSize; ++i) {
            const squareValue = squares[combo[i]];
            if (squareValue !== null) {
                counts[squareValue]++;
            }
        }
        if (counts[playerToMove] === boardSize - 1) {
            const index = combo.findIndex(squareIndex => squares[squareIndex] === null);
            if (index >= 0) {
                // if a winning square is found, return it immediately
                return combo[index];
            }
        }
        if (counts[opposingPlayer] === boardSize - 1) {
            const index = combo.findIndex(squareIndex => squares[squareIndex] === null);
            if (index >= 0) {
                opponentWinningSquare = combo[index];
            }
        }
    }
    return opponentWinningSquare !== undefined ? opponentWinningSquare : getRandomMove();
}

export function calculateNextMove(): number {
    const { squares, boardSize, moves, difficulty } = useGameStore.getState();
    const playerToMove = moves.length & 1 ? PlayerId.Two : PlayerId.One;
    switch (difficulty) {
        case Difficulty.Easy:
            return getRandomMove();
        case Difficulty.Medium:
            return getBestMoveLookingOneMoveAhead(boardSize, playerToMove, squares);
        case Difficulty.Difficult:
            const numberOfMovesRemaining = boardSize ** 2 - moves.length;
            return boardSize === 3 || numberOfMovesRemaining < 9
                ? getOptimalMove()
                : getBestMoveLookingOneMoveAhead(boardSize, playerToMove, squares);
    }
}
