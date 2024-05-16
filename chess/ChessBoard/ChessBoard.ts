import { Piece, PieceType } from "./ChessBoard.interface";

const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

class ChessBoard {
  pieces: Map<string, Piece>;

  constructor() {
    this.pieces = new Map();
  }

  putPiece(location: string, pieceType?: string, color?: string) {
    const piece: Piece = {
      type: pieceType || "",
      color: color === "dark" ? "DARK" : "LIGHT",
      location: location,
      hasMoved: false,
      canMoveTo: (targetLocation, context) =>
        this.canPieceMoveTo(piece.location, targetLocation, piece, context),
    };
    this.pieces.set(location, piece);
  }

  getMoveOptionCount(location: string) {
    return this.getMoveOptions(location).size;
  }

  getMoveOptions(location: string) {
    const moveOptions = new Set();
    const piece = this.pieces.get(location);
    const board = this;
    const context = {
      isEmpty(location: string): boolean {
        return board.isFieldEmpty(location);
      },
      hasDifferentlyColoredPiece(location: string, color: string) {
        return (
          !this.isEmpty(location) && board.pieces.get(location)?.color !== color
        );
      },
    };
    for (const row of rows) {
      for (const column of columns) {
        const targetLocation = column + row;
        if (
          piece &&
          piece.canMoveTo(targetLocation, context) &&
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

  private canPieceMoveTo(
    startLocation: string,
    targetLocation: string,
    piece: Piece,
    context: any
  ) {
    const pieceType = piece.type;
    const [startColumnIndex, startRowIndex] = this.toCoordinates(startLocation);
    const [targetColumnIndex, targetRowIndex] =
      this.toCoordinates(targetLocation);

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
      const hasMoved = piece.hasMoved;
      const signedVerticalOffset = targetRowIndex - startRowIndex;
      const isLight = piece.color === "LIGHT";
      const direction = isLight ? 1 : -1;
      const movementDistance = hasMoved ? 1 : 2;
      const isEmpty = context.isEmpty(targetLocation);
      const isValidVerticalMovement =
        isEmpty &&
        horizontalOffset === 0 &&
        signedVerticalOffset * direction > 0 &&
        Math.abs(signedVerticalOffset) <= movementDistance;
      const isValidDiagonalMovement =
        signedVerticalOffset * direction > 0 &&
        horizontalOffset === 1 &&
        verticalOffset === 1 &&
        context.hasDifferentlyColoredPiece(targetLocation, piece.color);
      return isValidDiagonalMovement || isValidVerticalMovement;
    }

    return false;
  }

  private toCoordinates(location: string) {
    const [locationColumn, locationRow] = location.split("");
    const columnIndex = columns.indexOf(locationColumn);
    const rowIndex = rows.indexOf(locationRow);
    return [columnIndex, rowIndex];
  }

  private hasDifferentlyColoredPieces(locationA: string, locationB: string) {
    let pieceA = this.pieces.get(locationA);
    let pieceB = this.pieces.get(locationB);
    return pieceA?.color !== pieceB?.color;
  }

  private isFieldEmpty(location: string): boolean {
    return !this.pieces.get(location);
  }

  private isOpenIntervalEmpty(startLocation: string, endLocation: string) {
    let insideFields: string[] = this.getInsideFields(
      startLocation,
      endLocation
    );

    return insideFields
      .map((field) => this.isFieldEmpty(field))
      .reduce((acc, it) => acc && it, true);
  }

  private getInsideFields(startLocation: string, endLocation: string) {
    const [startColumnIndex, startRowIndex] = this.toCoordinates(startLocation);
    const [endColumnIndex, endRowIndex] = this.toCoordinates(endLocation);

    const [columnOffset, rowOffset] = [
      endColumnIndex - startColumnIndex,
      endRowIndex - startRowIndex,
    ];

    const stepCount = this.gcd(columnOffset, rowOffset);
    const [dirColumn, dirRow] = [
      Math.floor(columnOffset / stepCount),
      Math.floor(rowOffset / stepCount),
    ];

    let insideFields: string[] = [];
    for (let i = 1; i < stepCount; i++) {
      const [fieldColumn, fieldRow] = [
        startColumnIndex + i * dirColumn,
        startRowIndex + i * dirRow,
      ];
      insideFields.push(`${columns[fieldColumn]}${rows[fieldRow]}`);
    }

    return insideFields;
  }

  private gcd(a: number, b: number): number {
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
