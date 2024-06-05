import ChessBoard, { PieceType } from "../ChessBoard";

export class TurnError extends Error {}

class Game {
  private isWhitesTurn: boolean = true;
  private board: ChessBoard;

  constructor() {
    this.board = new ChessBoard();
    this.board.putPiece("D2", PieceType.PAWN);
    this.board.putPiece("D7", PieceType.PAWN, "dark");
  }

  move(startLocation: string, targetLocation: string) {
    this.isWhitesTurn = !this.isWhitesTurn;
    throw new TurnError();
  }
}

export default Game;
