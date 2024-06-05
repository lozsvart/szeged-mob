import ChessBoard, { PieceType } from "../ChessBoard";

export class TurnError extends Error {}

class Game {
  #isWhitesTurn: boolean = true;
  #board: ChessBoard;

  constructor() {
    this.#board = new ChessBoard();
    this.#board.putPiece("D2", PieceType.PAWN);
    this.#board.putPiece("D7", PieceType.PAWN, "dark");
  }

  move(startLocation: string, targetLocation: string) {
    const piece = this.#board.getPiece(startLocation);
    if (piece && piece?.color !== "LIGHT") {
      throw new TurnError();
    }
    this.#board.movePiece(startLocation, targetLocation);
    this.#isWhitesTurn = !this.#isWhitesTurn;
  }
}

export default Game;
