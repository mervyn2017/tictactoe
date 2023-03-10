import { create } from 'zustand';
import Move from './Move';
import { checkForWinner } from './checkForWinner';
import { arrayImmutable } from '../utils';

interface GameState {
    redoStack: Move[];
    boardSize: number;
    squares: (number | null)[];
    winner: string | undefined;
    moves: Move[];

    initialize(): void;
    setBoardSize(boardSize: number): void;
    setWinner(winner: string): void;
    clearMoves(): void;
    executeMove(squareIndex: number): boolean;
    undoLastMove(): void;
    redoMove(): void;
    canRedo(): boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
    redoStack: [],
    boardSize: 3,
    squares: [],
    winner: undefined,
    moves: [],

    initialize: () =>
        set(() => ({
            redoStack: [],
            winner: undefined,
            moves: [],
            squares: Array(get().boardSize * get().boardSize).fill(null)
        })),

    setWinner: (winner: string | undefined) => set(() => ({ winner })),

    setBoardSize: (boardSize: number) => set(() => ({ boardSize })),

    clearMoves: () => set(() => ({ moves: [] })),

    executeMove(squareIndex: number): boolean {
        const { moves, squares, winner, boardSize } = get();
        if (winner || squares[squareIndex] !== null) {
            return !!winner;
        }
        const playerId = moves.length & 1 ? 1 : 0;
        const newSquares = arrayImmutable.update(squares, squareIndex, playerId);
        const newWinner = checkForWinner(boardSize, newSquares);
        set(() => ({
            moves: [...moves, new Move(squareIndex, playerId)],
            squares: newSquares,
            redoStack: [],
            winner: newWinner
        }));
        return !!newWinner;
    },

    undoLastMove() {
        const { redoStack, moves, squares } = get();
        if (moves.length === 0) {
            return;
        }
        const [newMoves, lastMove] = arrayImmutable.pop(moves);
        set(() => ({
            moves: newMoves,
            winner: undefined,
            squares: arrayImmutable.update(squares, lastMove.squareIndex, null),
            redoStack: arrayImmutable.push(redoStack, lastMove)
        }));
    },

    redoMove() {
        const { redoStack, moves, squares, boardSize } = get();
        if (redoStack.length) {
            const [newRedoStack, move] = arrayImmutable.pop(redoStack);
            const newSquares = arrayImmutable.update(squares, move.squareIndex, move.playerId);
            set(() => ({
                moves: arrayImmutable.push(moves, move),
                winner: checkForWinner(boardSize, newSquares),
                squares: newSquares,
                redoStack: newRedoStack
            }));
        }
    },

    canRedo() {
        return !!get().redoStack.length;
    }
}));
