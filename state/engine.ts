import { useGameStore } from './game';
import { getWinningCombinations } from './checkForWinner';
import { shuffle } from '../utils/statistics';
import { PlayerId } from './constants';

/**
 * Returns the index of the square of the next move for the given player
 * @param squares
 */
export function getPlayerTwoMoveRandom(): number {
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

// A simple algorithm that blocks a winning combination from the other player and picks
// a winning square when possible. Priority is given to a winning combo over blocking
// a losing combo when both are available.
function simpleAlgo(boardSize: number, squares: (number | null)[]) {
    const winningCombos = getWinningCombinations(boardSize);
    // look for any combination which has (boardSize-1) of the same player
    let losingSquare: number | undefined;
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
        if (counts[PlayerId.Two] === boardSize - 1) {
            const index = combo.findIndex(squareIndex => squares[squareIndex] === null);
            if (index >= 0) {
                // if a winning square is found, return it immediately
                return combo[index];
            }
        }
        if (counts[PlayerId.One] === boardSize - 1) {
            const index = combo.findIndex(squareIndex => squares[squareIndex] === null);
            if (index >= 0) {
                losingSquare = combo[index];
            }
        }
    }
    return losingSquare !== undefined ? losingSquare : getPlayerTwoMoveRandom();
}

export function getPlayerTwoMoveOptimal(): number {
    const state = useGameStore.getState();
    const { squares, boardSize, moves } = state;
    const playerId = moves.length & 1 ? PlayerId.Two : PlayerId.One;
    if (playerId === PlayerId.One) {
        throw new Error('Cant be player 1!');
    }
    if (boardSize === 3) {
        if (moves.length === 1) {
            // select the center square if it's available
            if (squares[4] === null) {
                return 4;
            } else {
                // randomly select any of the 4 corner squares
                const cornerIndices = [0, 2, 6, 8];
                for (let i of shuffle(cornerIndices)) {
                    if (squares[i] === null) {
                        return i;
                    }
                }
            }
        } else {
            return simpleAlgo(boardSize, squares);
        }
    } else {
        return simpleAlgo(boardSize, squares);
    }
}
