export enum PieceType {
  KNIGHT = "Knight",
  ROOK = "Rook",
  BISHOP = "Bishop",
  QUEEN = "Queen",
  KING = "King",
  PAWN = "Pawn",
}

export type PieceColor = "LIGHT" | "DARK";

export interface Piece {
  type: string;
  color: PieceColor;
}

export class MovementError extends Error {}
