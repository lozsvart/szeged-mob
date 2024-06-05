import ChessBoard from "../ChessBoard";

export class TurnError extends Error {}

class Game {
  private isWhitesTurn: boolean = true;
  private board: ChessBoard;

  constructor() {
    this.board = new ChessBoard();
  }

  move(startLocation: string, targetLocation: string) {
    this.isWhitesTurn = !this.isWhitesTurn;
    throw new TurnError();
  }
}

export default Game;
