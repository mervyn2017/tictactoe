import { create } from 'zustand';
import Move from './Move';
import { checkForWinner } from './checkForWinner';
import { produce } from 'immer';
import { PlayerId } from './constants';

export enum Difficulty {
    Easy = 'EASY',
    Medium = 'MEDIUM',
    Difficult = 'DIFFICULT'
}

interface GameState {
    playComputer: boolean;
    difficulty: Difficulty;
    redoStack: Move[];
    boardSize: number;
    squares: (PlayerId | null)[];
    winner: PlayerId | null;
    moves: Move[];
    gameOver: boolean;

    setPlayComputer(playComputer: boolean): void;
    setDifficulty(difficulty: Difficulty): void;
    reset(): void;
    setBoardSize(boardSize: number): void;
    executeMove(squareIndex: number): boolean;
    undoLastMove(): void;
    redoMove(): void;
    canRedo(): boolean;
}

const getDefaults = (boardSize: number) => ({
    playComputer: true,
    difficulty: Difficulty.Medium,
    redoStack: [],
    boardSize,
    squares: Array(boardSize ** 2).fill(null),
    winner: null,
    moves: [],
    gameOver: false
});

export const useGameStore = create<GameState>((set, get) => ({
    ...getDefaults(3),

    setPlayComputer(playComputer: boolean) {
        const { boardSize, difficulty } = get();
        set(() => ({
            ...getDefaults(boardSize),
            playComputer,
            difficulty
        }));
    },

    setDifficulty(difficulty: Difficulty) {
        const { boardSize, playComputer } = get();
        set(() => ({
            ...getDefaults(boardSize),
            playComputer,
            difficulty
        }));
    },

    reset() {
        const { boardSize, playComputer, difficulty } = get();
        set(() => ({
            ...getDefaults(boardSize),
            playComputer,
            difficulty
        }));
    },

    setBoardSize(boardSize: number) {
        const { playComputer, difficulty } = get();
        if (boardSize !== get().boardSize) {
            set(() => ({
                ...getDefaults(boardSize),
                playComputer,
                difficulty
            }));
        }
    },

    executeMove(squareIndex: number): boolean {
        const { moves, squares, winner, boardSize } = get();
        if (winner || squares[squareIndex] !== null) {
            return !!winner;
        }
        const playerId = moves.length & 1 ? PlayerId.Two : PlayerId.One;
        const newSquares: (PlayerId | null)[] = produce(squares, draft => {
            draft[squareIndex] = playerId;
        });
        const newWinner = checkForWinner(boardSize, newSquares);
        const newMoves = [...moves, new Move(squareIndex, playerId)];
        set(() => ({
            moves: newMoves,
            squares: newSquares,
            redoStack: [],
            winner: newWinner,
            gameOver: !!newWinner || newMoves.length === boardSize ** 2
        }));
        return !!newWinner;
    },

    undoLastMove() {
        const { redoStack, moves, squares } = get();
        if (moves.length === 0) {
            return;
        }
        const newMoves = moves.slice();
        const lastMove = newMoves.pop()!;
        set(() => ({
            moves: newMoves,
            winner: null,
            gameOver: false,
            squares: produce(squares, draft => {
                draft[lastMove.squareIndex] = null;
            }),
            redoStack: produce(redoStack, draft => {
                draft.push(lastMove);
            })
        }));
    },

    redoMove() {
        const { redoStack, moves, squares, boardSize } = get();
        if (redoStack.length) {
            const newRedoStack = redoStack.slice();
            const move = newRedoStack.pop()!;
            const newSquares = produce(squares, draft => {
                draft[move.squareIndex] = move.playerId;
            });
            const newWinner = checkForWinner(boardSize, newSquares);
            const newMoves = produce(moves, draft => {
                draft.push(move);
            });
            set(() => ({
                moves: newMoves,
                winner: newWinner,
                gameOver: !!newWinner || newMoves.length === boardSize ** 2,
                squares: newSquares,
                redoStack: newRedoStack
            }));
        }
    },

    canRedo() {
        return !!get().redoStack.length;
    }
}));
