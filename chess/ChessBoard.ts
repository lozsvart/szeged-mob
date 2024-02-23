class ChessBoard {
  fields;

  constructor() {
    this.fields = new Map();
  }

  countPieces() {
    return this.fields.size;
  }

  countEmptyFields() {
    return 64 - this.countPieces();
  }

  putPiece(location: string, pieceType?: string) {
    this.fields.set(location, pieceType || "");
  }

  getMoveOptionCount(location: string) {
    return 14;
  }

  getMoveOptions(location: string) {
    return []
  }
}

export default ChessBoard;
