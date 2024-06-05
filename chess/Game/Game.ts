import ChessBoard, {
  PieceType,
  Piece,
  Location,
  Column,
  PieceColor,
  CheckError,
} from "../ChessBoard";

export class TurnError extends Error {}

class Game {
  #isWhitesTurn: boolean = true;
  #colorToMove: PieceColor = "LIGHT";
  #board: ChessBoard;

  static defaultGame() {
    return new Game({
      A1: { type: PieceType.ROOK, color: "LIGHT" },
      B1: { type: PieceType.KNIGHT, color: "LIGHT" },
      C1: { type: PieceType.BISHOP, color: "LIGHT" },
      D1: { type: PieceType.QUEEN, color: "LIGHT" },
      E1: { type: PieceType.KING, color: "LIGHT" },
      F1: { type: PieceType.BISHOP, color: "LIGHT" },
      G1: { type: PieceType.KNIGHT, color: "LIGHT" },
      H1: { type: PieceType.ROOK, color: "LIGHT" },
      A2: { type: PieceType.PAWN, color: "LIGHT" },
      B2: { type: PieceType.PAWN, color: "LIGHT" },
      C2: { type: PieceType.PAWN, color: "LIGHT" },
      D2: { type: PieceType.PAWN, color: "LIGHT" },
      E2: { type: PieceType.PAWN, color: "LIGHT" },
      F2: { type: PieceType.PAWN, color: "LIGHT" },
      G2: { type: PieceType.PAWN, color: "LIGHT" },
      H2: { type: PieceType.PAWN, color: "LIGHT" },
      A8: { type: PieceType.ROOK, color: "DARK" },
      B8: { type: PieceType.KNIGHT, color: "DARK" },
      C8: { type: PieceType.BISHOP, color: "DARK" },
      D8: { type: PieceType.QUEEN, color: "DARK" },
      E8: { type: PieceType.KING, color: "DARK" },
      F8: { type: PieceType.BISHOP, color: "DARK" },
      G8: { type: PieceType.KNIGHT, color: "DARK" },
      H8: { type: PieceType.ROOK, color: "DARK" },
      A7: { type: PieceType.PAWN, color: "DARK" },
      B7: { type: PieceType.PAWN, color: "DARK" },
      C7: { type: PieceType.PAWN, color: "DARK" },
      D7: { type: PieceType.PAWN, color: "DARK" },
      E7: { type: PieceType.PAWN, color: "DARK" },
      F7: { type: PieceType.PAWN, color: "DARK" },
      G7: { type: PieceType.PAWN, color: "DARK" },
      H7: { type: PieceType.PAWN, color: "DARK" },
    });
  }

  constructor(startPieces: Partial<Record<Location, Piece>>) {
    this.#board = new ChessBoard();
    for (let [location, piece] of Object.entries(startPieces)) {
      this.#board.putPiece(location as Location, piece.type, piece.color);
    }
  }

  move(startLocation: Location, targetLocation: Location) {
    const piece = this.#board.getPiece(startLocation);
    if (piece && this.#colorToMove !== piece?.color) {
      throw new TurnError();
    }

    this.#board.movePiece(startLocation, targetLocation);
    if (this.getCheckedColors().has("LIGHT")) {
      throw new CheckError();
    }
    this.#isWhitesTurn = !this.#isWhitesTurn;
    this.#colorToMove = this.#colorToMove === "LIGHT" ? "DARK" : "LIGHT";
  }

  private getCheckedColors(): Set<PieceColor> {
    if (this.#board.getPiece("A2")?.type === PieceType.KING) {
      return new Set(["LIGHT"]);
    }
    return new Set();
  }
}

export default Game;
