import { useGameStore } from './game';
import { getWinningCombinations } from './checkForWinner';
import { PlayerId } from './constants';
import { shuffle } from '../utils/statistics';

// Find all the possible winning combinations involving each square on the board
function createMapOfWinningCombosForEachSquare(boardSize) {
    const numberSquares = boardSize ** 2;
    const map = [];

    const winningCombos = getWinningCombinations(boardSize);
    for (let i = 0; i < numberSquares; ++i) {
        const combos = [];
        map.push(combos);
        for (const combo of winningCombos) {
            if (combo.some(squareIndex => squareIndex === i)) {
                combos.push(combo);
            }
        }
    }
    return map;
}

const winningCombosMap = new Map();
for (let boardSize = 3; boardSize <= 5; ++boardSize) {
    winningCombosMap.set(boardSize, createMapOfWinningCombosForEachSquare(boardSize));
}

enum Outcome {
    WIN = 1,
    LOSE = 2,
    DRAW = 3
}

function playerWins(boardSize: number, winningCombos, squares: (PlayerId | null)[]): boolean {
    for (const combo of winningCombos) {
        const playerId = squares[combo[0]];
        if (playerId !== null) {
            let hasWinner = true;
            for (let i = 1; hasWinner && i < boardSize; ++i) {
                hasWinner = hasWinner && playerId === squares[combo[i]];
            }
            if (hasWinner) {
                return true;
            }
        }
    }
    return false;
}

function calcBestMove(
    boardSize: number,
    numSquares,
    winningComboMap,
    squares: (PlayerId | null)[],
    numMoves: number
): Outcome {
    if (numMoves === numSquares) {
        return Outcome.DRAW;
    }
    const playerToMove = numMoves & 1 ? PlayerId.Two : PlayerId.One;
    let bestOutcome: Outcome;
    for (let i = 0; i < numSquares; ++i) {
        if (squares[i] === null) {
            squares[i] = playerToMove;
            if (playerWins(boardSize, winningComboMap[i], squares)) {
                squares[i] = null;
                return Outcome.WIN;
            }
            const outcome = calcBestMove(boardSize, numSquares, winningComboMap, squares, numMoves + 1);
            squares[i] = null;
            switch (outcome) {
                case Outcome.WIN:
                    if (bestOutcome === undefined) {
                        bestOutcome = Outcome.LOSE;
                    }
                    break;
                case Outcome.LOSE:
                    return Outcome.WIN;
                case Outcome.DRAW:
                    bestOutcome = Outcome.DRAW;
                    break;
            }
        }
    }
    return bestOutcome;
}

export function getOptimalMove(): number {
    const { squares, boardSize, moves } = useGameStore.getState();
    const numSquares = boardSize ** 2;
    const winningComboMap = winningCombosMap.get(boardSize);
    const numMoves = moves.length;
    const squaresTemp = squares.slice();
    const playerToMove = numMoves & 1 ? PlayerId.Two : PlayerId.One;
    const remainingMoves = [];
    for (let i = 0; i < numSquares; ++i) {
        if (squaresTemp[i] === null) {
            remainingMoves.push(i);
        }
    }
    // just to insert some variation into the game
    shuffle(remainingMoves);

    let bestMove;
    for (let move of remainingMoves) {
        squaresTemp[move] = playerToMove;
        if (playerWins(boardSize, winningComboMap[move], squaresTemp)) {
            return move;
        }
        const outcome = calcBestMove(boardSize, numSquares, winningComboMap, squaresTemp, numMoves + 1);
        squaresTemp[move] = null;
        switch (outcome) {
            case Outcome.WIN:
                if (bestMove === undefined) {
                    bestMove = move;
                }
                break;
            case Outcome.LOSE:
                return move;
            case Outcome.DRAW:
                bestMove = move;
                break;
        }
    }
    return bestMove;
}
