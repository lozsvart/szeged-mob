export enum PieceType {
  KNIGHT = "Knight",
  ROOK = "Rook",
  BISHOP = "Bishop",
  QUEEN = "Queen",
  KING = "King",
  PAWN = "Pawn",
}

export interface Piece {
  type: string;
  color: "LIGHT" | "DARK";
}
