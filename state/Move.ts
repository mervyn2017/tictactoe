import { PlayerId } from './constants';

export default class Move {
    public readonly squareIndex: number;
    public readonly playerId: PlayerId;

    constructor(squareIndex: number, playerId: PlayerId) {
        this.squareIndex = squareIndex;
        this.playerId = playerId;
    }
}
