export type Row = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Column = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type Location = `${Column}${Row}`;

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
export class CheckError extends MovementError {}
