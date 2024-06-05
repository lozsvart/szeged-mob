import ChessBoard, { PieceType, Piece } from "../ChessBoard";

export class TurnError extends Error {}

class Game {
  #isWhitesTurn: boolean = true;
  #board: ChessBoard;

  constructor() {
    this.#board = new ChessBoard();
    const startPieces: Record<string, Piece> = {
      A1: { type: PieceType.PAWN, color: "LIGHT" },
      B1: { type: PieceType.PAWN, color: "LIGHT" },
      C1: { type: PieceType.PAWN, color: "LIGHT" },
      D1: { type: PieceType.PAWN, color: "LIGHT" },
      E1: { type: PieceType.PAWN, color: "LIGHT" },
      F1: { type: PieceType.PAWN, color: "LIGHT" },
      G1: { type: PieceType.PAWN, color: "LIGHT" },
      H1: { type: PieceType.PAWN, color: "LIGHT" },
      A2: { type: PieceType.PAWN, color: "LIGHT" },
      B2: { type: PieceType.PAWN, color: "LIGHT" },
      C2: { type: PieceType.PAWN, color: "LIGHT" },
      D2: { type: PieceType.PAWN, color: "LIGHT" },
      E2: { type: PieceType.PAWN, color: "LIGHT" },
      F2: { type: PieceType.PAWN, color: "LIGHT" },
      G2: { type: PieceType.PAWN, color: "LIGHT" },
      H2: { type: PieceType.PAWN, color: "LIGHT" },
    };
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
