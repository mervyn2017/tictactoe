import { useGameStore, Difficulty } from './game';
import { getWinningCombinations } from './checkForWinner';
import { shuffle } from '../utils/statistics';
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

// A simple algorithm that blocks a winning combination from the other player and picks
// a winning square when possible. Priority is given to a winning combo over blocking
// a losing combo when both are available.
function getBestMoveLookingOneMoveAhead(boardSize: number, squares: (number | null)[], playerToMove: PlayerId) {
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

// export function getBestMoveLookingOneMoveAhead(): number {
//     const { squares, boardSize, moves } = useGameStore.getState();
//     const playerToMove = moves.length & 1 ? PlayerId.Two : PlayerId.One;
// if (boardSize === 3) {
//     if (moves.length === 1) {
//         // select the center square if it's available
//         if (squares[4] === null) {
//             return 4;
//         } else {
//             // randomly select any of the 4 corner squares
//             const cornerIndices = [0, 2, 6, 8];
//             for (let i of shuffle(cornerIndices)) {
//                 if (squares[i] === null) {
//                     return i;
//                 }
//             }
//         }
//     } else {
//         return simpleAlgo(boardSize, squares, playerToMove);
//     }
// } else {
// return simpleAlgo(boardSize, squares, playerToMove);
// }
// }

export function calculateNextMove(): number {
    const { squares, boardSize, moves, difficulty } = useGameStore.getState();
    const playerToMove = moves.length & 1 ? PlayerId.Two : PlayerId.One;
    switch (difficulty) {
        case Difficulty.Easy:
            return getRandomMove();
        case Difficulty.Medium:
            return getBestMoveLookingOneMoveAhead(boardSize, squares, playerToMove);
        case Difficulty.Difficult:
            return boardSize === 3
                ? getOptimalMove()
                : getBestMoveLookingOneMoveAhead(boardSize, squares, playerToMove);
    }
}
