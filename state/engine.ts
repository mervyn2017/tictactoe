import { useGameStore } from './game';
import { getWinningCombinations } from './checkForWinner';
import { shuffle } from '../utils/statistics';

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

// function getNextMove(boardSize: number, squares: (1 | 2 | null)[], playerId: number) {
//     // console.log('getNextMove', playerId, squares);
//     let bestScore = -1000;
//     let bestMove: number;
//     for (let i = 0; i < squares.length; ++i) {
//         if (squares[i] === null) {
//             squares[i] = playerId;
//             const winner = checkForWinner(boardSize, squares);
//             if (winner) {
//                 const score = playerId === 0 ? 1 : -1;
//                 if (score > bestScore) {
//                     bestScore = score;
//                     bestMove = i;
//                 }
//                 squares[i] = null;
//                 continue;
//             } else {
//                 const score = getNextMove(boardSize, squares, playerId === 0 ? 1 : 0);
//                 squares[i] = null;
//                 if (score > bestScore) {
//                     bestScore = score;
//                     bestMove = i;
//                 }
//             }
//         }
//     }
//     return bestMove;
// }

// A simple algorithm that blocks a winning combination from the other
// player and picks a winning square when possible.
function simpleAlgo(boardSize: number, squares: (number | null)[]) {
    const winningCombos = getWinningCombinations(boardSize);
    for (const combo of winningCombos) {
        const counts = [0, 0];
        for (let i = 0; i < boardSize; ++i) {
            const squareValue = squares[combo[i]];
            if (squareValue !== null) {
                counts[squareValue]++;
            }
        }
        if (counts.some(count => count === boardSize - 1)) {
            const index = combo.findIndex(squareIndex => squares[squareIndex] === null);
            if (index >= 0) {
                return combo[index];
            }
        }
    }
    return getPlayerTwoMoveRandom();
}

export function getPlayerTwoMoveOptimal(): number {
    const state = useGameStore.getState();
    const { squares, boardSize, moves } = state;
    const playerId = moves.length & 1 ? 1 : 0;
    if (playerId === 0) {
        throw new Error('cant be player 0');
    }
    if (boardSize === 3) {
        // const nextMove = getNextMove(boardSize, squares.slice(), playerId);
        // return nextMove;

        if (moves.length === 1) {
            if (squares[4] === null) {
                return 4;
            } else {
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
