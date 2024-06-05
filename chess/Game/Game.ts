import ChessBoard, { PieceType, Piece } from "../ChessBoard";

export class TurnError extends Error {}

class Game {
  #isWhitesTurn: boolean = true;
  #board: ChessBoard;

  constructor() {
    this.#board = new ChessBoard();
    const startPieces: Array<[String, Piece]> = [
      [
        "A2",
        {
          type: PieceType.PAWN,
          color: "DARK",
        },
      ],
    ];
    this.#board.putPiece("C2", PieceType.PAWN);
    this.#board.putPiece("D2", PieceType.PAWN);
    this.#board.putPiece("D7", PieceType.PAWN, "dark");
  }

  move(startLocation: string, targetLocation: string) {
    const piece = this.#board.getPiece(startLocation);
    if (
      piece &&
      ((this.#isWhitesTurn && piece?.color !== "LIGHT") ||
        (!this.#isWhitesTurn && piece?.color !== "DARK"))
    ) {
      throw new TurnError();
    }
    this.#board.movePiece(startLocation, targetLocation);
    this.#isWhitesTurn = !this.#isWhitesTurn;
  }
}

export default Game;
