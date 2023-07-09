import { useGameStore } from './game';
import { getWinningCombinations } from './checkForWinner';
import { PlayerId } from './constants';

const constants = {
    3: {
        numSquares: 3 ** 2,
        winningCombos: getWinningCombinations(3)
    },
    4: {
        numSquares: 4 ** 2,
        winningCombos: getWinningCombinations(4)
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

function hasWinner(boardSize: number, winningCombos, squares: (PlayerId | null)[]): boolean {
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
    const { numSquares, winningCombos } = constants[boardSize];
    const playerToMove = numMoves & 1 ? PlayerId.Two : PlayerId.One;
    if (numMoves === numSquares) {
        return { outcome: Outcome.DRAW };
    }

    let bestMove;
    for (let i = 0; i < numSquares; ++i) {
        if (squares[i] === null) {
            squares[i] = playerToMove;
            if (hasWinner(boardSize, winningCombos, squares)) {
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
    if (moves.length === boardSize ** 2) {
        throw new Error('Game is already over!');
    }
    const numMoves = moves.length;
    const playerToMove = numMoves & 1 ? PlayerId.Two : PlayerId.One;
    const result = calcBestMove(boardSize, playerToMove, squares.slice(), numMoves);
    return result.move;
}

// 0 - 4 - 8 - 7 - 1 - 2 - 6 - 5 - 3
