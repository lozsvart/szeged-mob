import {
  Column,
  Coordinates,
  Location,
  MovementError,
  Piece,
  PieceColor,
  PieceType,
  Row,
} from "./ChessBoard.interface";

const rows: Array<Row> = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns: Array<Column> = ["A", "B", "C", "D", "E", "F", "G", "H"];

class ChessBoard {
  #pieces: Map<Location, Piece>;
  #piecesSnapshot: Map<Location, Piece>;

  constructor() {
    this.#pieces = new Map();
    this.#piecesSnapshot = new Map();
  }

  snapshot() {
    this.#piecesSnapshot = new Map(this.#pieces);
  }

  restoreSnapshot() {
    this.#pieces = new Map(this.#piecesSnapshot);
  }

  getPiece(location: Location) {
    return this.#pieces.get(location);
  }

  countPieces() {
    return this.#pieces.size;
  }

  getPiecesByColor(color: PieceColor) {
    let result = new Map<Location, Piece>();
    for (const [location, piece] of this.#pieces.entries()) {
      if (piece.color === color) {
        // We might need to use deep-copy instead
        result.set(location, piece);
      }
    }
    return result;
  }

  putPiece(location: Location, pieceType?: string, color?: PieceColor) {
    const piece: Piece = {
      type: pieceType || "",
      color: color || "LIGHT",
    };
    this.#pieces.set(location, piece);
  }

  getMoveOptionCount(location: Location) {
    return this.getMoveOptions(location).size;
  }

  getMoveOptions(location: Location) {
    const moveOptions = new Set<Location>();
    const piece = this.#pieces.get(location);
    for (const row of rows) {
      for (const column of columns) {
        const targetLocation = `${column}${row}` as Location;
        if (
          piece &&
          this.canPieceMoveTo(location, targetLocation, piece) &&
          this.isOpenIntervalEmpty(location, targetLocation) &&
          (this.isFieldEmpty(targetLocation) ||
            this.hasDifferentlyColoredPieces(location, targetLocation))
        ) {
          moveOptions.add(targetLocation);
        }
      }
    }

    return moveOptions;
  }

  movePiece(
    startLocation: Location,
    targetLocation: Location,
    force = false as Boolean
  ) {
    if (!this.getMoveOptions(startLocation).has(targetLocation) && !force) {
      throw new MovementError();
    }
    this.#pieces.set(targetLocation, this.#pieces.get(startLocation) as Piece);
    this.#pieces.delete(startLocation);
  }

  private canPieceMoveTo(
    startLocation: Location,
    targetLocation: Location,
    piece: Piece
  ) {
    const pieceType = piece.type;
    const [startColumnIndex, startRowIndex] =
      ChessBoard.toCoordinates(startLocation);
    const [targetColumnIndex, targetRowIndex] =
      ChessBoard.toCoordinates(targetLocation);

    const horizontalOffset = Math.abs(startColumnIndex - targetColumnIndex);
    const verticalOffset = Math.abs(startRowIndex - targetRowIndex);
    const isDiagonalMovement = horizontalOffset === verticalOffset;
    const isOrthogonalMovement =
      startColumnIndex === targetColumnIndex ||
      startRowIndex === targetRowIndex;

    if (pieceType === PieceType.BISHOP) {
      return isDiagonalMovement;
    }

    if (pieceType === PieceType.ROOK) {
      return isOrthogonalMovement;
    }

    if (pieceType === PieceType.QUEEN) {
      return isDiagonalMovement || isOrthogonalMovement;
    }

    if (pieceType === PieceType.KNIGHT) {
      const isValidKnightMovement =
        (horizontalOffset === 1 && verticalOffset === 2) ||
        (horizontalOffset === 2 && verticalOffset === 1);

      return isValidKnightMovement;
    }

    if (pieceType === PieceType.KING) {
      const isValidKingMovement =
        Math.max(horizontalOffset, verticalOffset) <= 1;

      return isValidKingMovement;
    }

    if (pieceType === PieceType.PAWN) {
      const isLight = piece.color === "LIGHT";
      const signedVerticalOffset = targetRowIndex - startRowIndex;
      const isCorrectDirection = isLight
        ? signedVerticalOffset === 1
        : signedVerticalOffset === -1;
      const verticalDirection = isLight ? 1 : -1;
      const isTargetLocationEmpty = this.isFieldEmpty(targetLocation);
      const isValidDiagonalMove =
        horizontalOffset === 1 && !isTargetLocationEmpty && isCorrectDirection;
      const isInitialMove = isLight ? startRowIndex === 1 : startRowIndex === 6;
      const isValidVerticalMovement =
        horizontalOffset === 0 &&
        isTargetLocationEmpty &&
        verticalDirection * signedVerticalOffset > 0 &&
        verticalOffset <= (isInitialMove ? 2 : 1);

      return isValidVerticalMovement || isValidDiagonalMove;
    }

    return false;
  }

  static toCoordinates(location: Location): Coordinates {
    const [locationColumn, locationRow] = location.split("") as [Column, Row];
    const columnIndex = columns.indexOf(locationColumn);
    const rowIndex = rows.indexOf(locationRow);
    return [columnIndex, rowIndex];
  }

  private hasDifferentlyColoredPieces(
    locationA: Location,
    locationB: Location
  ) {
    let pieceA = this.#pieces.get(locationA);
    let pieceB = this.#pieces.get(locationB);
    return pieceA?.color !== pieceB?.color;
  }

  private isFieldEmpty(location: Location): boolean {
    return !this.#pieces.get(location);
  }

  private isOpenIntervalEmpty(startLocation: Location, endLocation: Location) {
    let insideFields: Location[] = ChessBoard.getInsideFields(
      startLocation,
      endLocation
    );

    return insideFields
      .map((field) => this.isFieldEmpty(field))
      .reduce((acc, it) => acc && it, true);
  }

  static getInsideFields(
    startLocation: Location,
    endLocation: Location
  ): Location[] {
    const [startColumnIndex, startRowIndex] =
      ChessBoard.toCoordinates(startLocation);
    const [endColumnIndex, endRowIndex] = ChessBoard.toCoordinates(endLocation);

    const [columnOffset, rowOffset] = [
      endColumnIndex - startColumnIndex,
      endRowIndex - startRowIndex,
    ];

    const stepCount = ChessBoard.gcd(columnOffset, rowOffset);
    const [dirColumn, dirRow] = [
      Math.floor(columnOffset / stepCount),
      Math.floor(rowOffset / stepCount),
    ];

    let insideFields: Location[] = [];
    for (let i = 1; i < stepCount; i++) {
      const coordinates: Coordinates = [
        startColumnIndex + i * dirColumn,
        startRowIndex + i * dirRow,
      ];
      insideFields.push(ChessBoard.toLocation(coordinates));
    }

    return insideFields;
  }

  static toLocation([columnIndex, rowIndex]: Coordinates): Location {
    return `${columns[columnIndex]}${rows[rowIndex]}`;
  }

  private static gcd(a: number, b: number): number {
    let absA = Math.abs(a);
    let absB = Math.abs(b);
    if (absA === 0) {
      return absB;
    }
    if (absB === 0) {
      return absA;
    }

    return this.gcd(absB, absA % absB);
  }
}

export default ChessBoard;
