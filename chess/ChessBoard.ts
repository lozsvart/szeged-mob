class ChessBoard {
  pieces: Map<string, Piece>;
  rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
  columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

  constructor() {
    this.pieces = new Map();
  }

  countPieces() {
    return this.pieces.size;
  }

  countEmptyFields() {
    return 64 - this.countPieces();
  }

  putPiece(location: string, pieceType?: string, color?: string) {
    const piece: Piece = {
      type: pieceType || "",
      color: color === "dark" ? "DARK" : "LIGHT",
    };
    this.pieces.set(location, piece);
  }

  getMoveOptionCount(location: string) {
    return this.getMoveOptions(location).size;
  }

  getMoveOptions(location: string) {
    const moveOptions = new Set();
    for (const row of this.rows) {
      for (const column of this.columns) {
        const targetLocation = column + row;
        if (
          this.canPieceMoveTo(location, targetLocation, this.pieces.get(location)?.type) &&
          this.isOpenIntervalEmpty(location, targetLocation) &&
          (this.isFieldEmpty(targetLocation) ||
            this.hasDifferentlyColoredPieces(location, targetLocation))
        ) {
          if (targetLocation !== location) {
            moveOptions.add(targetLocation);
          }
        }
      }
    }

    return moveOptions;
  }

  private canPieceMoveTo(
    startLocation: string,
    targetLocation: string,
    pieceType?: string
  ) {
    const [startLocationColumn, startLocationRow] = startLocation.split("");
    const [targetLocationColumn, targetLocationRow] = targetLocation.split("");
    const startColumnIndex = this.columns.indexOf(startLocationColumn);
    const startRowIndex = this.rows.indexOf(startLocationRow);
    const targetColumnIndex = this.columns.indexOf(targetLocationColumn);
    const targetRowIndex = this.rows.indexOf(targetLocationRow);

    if (pieceType === "Bishop") {
      return Math.abs(startColumnIndex - targetColumnIndex) === Math.abs(startRowIndex - targetRowIndex);
    }

    return (
      startColumnIndex === targetColumnIndex ||
      startRowIndex === targetRowIndex
    );
  }

  hasDifferentlyColoredPieces(locationA: string, locationB: string) {
    let pieceA = this.pieces.get(locationA);
    let pieceB = this.pieces.get(locationB);
    return pieceA?.color !== pieceB?.color;
  }

  isFieldEmpty(location: string): boolean {
    return !this.pieces.get(location);
  }

  isOpenIntervalEmpty(startLocation: string, endLocation: string) {
    let insideFields: string[] = this.getInsideFields(
      startLocation,
      endLocation
    );

    return insideFields
      .map((field) => this.isFieldEmpty(field))
      .reduce((acc, it) => acc && it, true);
  }

  private getInsideFields(startLocation: string, endLocation: string) {
    const [startLocationColumn, startLocationRow] = startLocation.split("");
    const [endLocationColumn, endLocationRow] = endLocation.split("");
    const startColumnIndex = this.columns.indexOf(startLocationColumn);
    const startRowIndex = this.rows.indexOf(startLocationRow);
    const endColumnIndex = this.columns.indexOf(endLocationColumn);
    const endRowIndex = this.rows.indexOf(endLocationRow);

    const isColumn = startColumnIndex === endColumnIndex;
    let insideFields: string[] = [];
    if (isColumn) {
      const fields = this.rows.map((row) => {
        return `${startLocationColumn}${row}`;
      });
      insideFields = fields.slice(
        Math.min(startRowIndex, endRowIndex) + 1,
        Math.max(startRowIndex, endRowIndex)
      );
    }
    const isRow = startRowIndex === endRowIndex;
    if (isRow) {
      const fields = this.columns.map((column) => {
        return `${column}${startLocationRow}`;
      });

      insideFields = fields.slice(
        Math.min(startColumnIndex, endColumnIndex) + 1,
        Math.max(startColumnIndex, endColumnIndex)
      );
    }
    return insideFields;
  }
}

interface Piece {
  type: string;
  color: "LIGHT" | "DARK";
}

export default ChessBoard;
