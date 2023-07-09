import { useGameStore } from './game';
import { getWinningCombinations } from './checkForWinner';
import { PlayerId } from './constants';

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

const constants = {
    3: {
        numSquares: 3 ** 2,
        winningComboMap: createMapOfWinningCombosForEachSquare(3)
    },
    4: {
        numSquares: 4 ** 2,
        winningComboMap: createMapOfWinningCombosForEachSquare(4)
    },
    5: {
        numSquares: 5 ** 2,
        winningComboMap: createMapOfWinningCombosForEachSquare(5)
    }
};

enum Outcome {
    WIN = 'WIN',
    LOSE = 'LOSE',
    DRAW = 'DRAW'
}

type Result = {
    move?: number;
    outcome: Outcome;
};

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

function calcBestMove(boardSize: number, playerId: PlayerId, squares: (PlayerId | null)[], numMoves: number): Result {
    const { numSquares, winningComboMap } = constants[boardSize];
    const playerToMove = numMoves & 1 ? PlayerId.Two : PlayerId.One;
    if (numMoves === numSquares) {
        return { outcome: Outcome.DRAW };
    }

    let bestMove;
    for (let i = 0; i < numSquares; ++i) {
        if (squares[i] === null) {
            squares[i] = playerToMove;
            if (playerWins(boardSize, winningComboMap[i], squares)) {
                squares[i] = null;
                return { move: i, outcome: Outcome.WIN };
            }
            const result = calcBestMove(boardSize, playerId, squares, numMoves + 1);
            squares[i] = null;
            switch (result.outcome) {
                case Outcome.WIN:
                    if (!bestMove) {
                        bestMove = { move: i, outcome: Outcome.LOSE };
                    }
                    break;
                case Outcome.LOSE:
                    return { move: i, outcome: Outcome.WIN };
                default:
                    bestMove = { move: i, outcome: Outcome.DRAW };
                    break;
            }
        }
    }
    return bestMove;
}

export function getOptimalMove(): number {
    const { squares, boardSize, moves } = useGameStore.getState();
    const numMoves = moves.length;
    const playerToMove = numMoves & 1 ? PlayerId.Two : PlayerId.One;
    const result = calcBestMove(boardSize, playerToMove, squares.slice(), numMoves);
    return result.move;
}
