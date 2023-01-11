export default class Move {
    readonly playerName: string;

    constructor(public readonly squareIndex: number, public readonly playerId: number) {
        this.playerName = playerId === 0 ? 'Player 1' : 'Player 2';
    }

    toString() {
        return `Move: ${this.squareIndex} : ${this.playerName}`;
    }
}
