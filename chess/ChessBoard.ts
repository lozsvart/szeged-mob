class ChessBoard {
  fields;
  rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
  columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

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
    return this.getMoveOptions(location).size;
  }

  getMoveOptions(location: string) {
    const moveOptions = new Set();
    for (const row of this.rows) {
      for (const column of this.columns) {
        const targetLocation = column + row;
        if (
          (row === location[1] || column === location[0]) &&
          this.isOpenIntervalEmpty(location, targetLocation) &&
          this.isFieldEmpty(targetLocation)
        ) {
          if (targetLocation !== location) {
            moveOptions.add(targetLocation);
          }
        }
      }
    }

    return moveOptions;
  }
  isFieldEmpty(location: string): boolean {
    return !this.fields.get(location);
  }

  isOpenIntervalEmpty(startLocation: string, endLocation: string) {
    
    let insideFields: string[] = this.getInsideFields(startLocation, endLocation);

    return insideFields.map((field) => this.isFieldEmpty(field))
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
      const fields = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"];
      insideFields = fields.slice(Math.min(startRowIndex, endRowIndex) + 1,
        Math.max(startRowIndex, endRowIndex));
    }
    const isRow = startRowIndex === endRowIndex;
    if (isRow) {
      const fields = this.columns.map((column) => {
        return `${column}${startLocationRow}`
      })
      
      insideFields = fields.slice(Math.min(startColumnIndex, endColumnIndex) + 1,
        Math.max(startColumnIndex, endColumnIndex));
    }
    return insideFields;
  }
}

export default ChessBoard;
