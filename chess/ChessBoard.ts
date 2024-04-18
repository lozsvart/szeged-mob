const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

class ChessBoard {
  pieces: Map<string, Piece>;

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
    for (const row of rows) {
      for (const column of columns) {
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
    const [startColumnIndex, startRowIndex] = toCoordinates(startLocation)
    const [targetColumnIndex, targetRowIndex] = toCoordinates(targetLocation)

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
    const [startColumnIndex, startRowIndex] = toCoordinates(startLocation);
    const [endColumnIndex, endRowIndex] = toCoordinates(endLocation);
    const [dColumn, dRow] = [endColumnIndex-startColumnIndex, endRowIndex-startRowIndex]
    const segments = gcd(dColumn, dRow)
    if (segments === 0) {
      return []
    }
    const [dirColumn, dirRow] = [Math.floor(dColumn / segments), Math.floor(dRow / segments)]

    const result: string[] = []
    for (let i = 1; i < segments; i++) {
      result.push(format([startColumnIndex + i * dirColumn, startRowIndex + i * dirRow]))
    }
    return result
  }
}

function toCoordinates(location: string) {
  const [column, row] = location.split("");
  return [columns.indexOf(column), rows.indexOf(row)]
}

function format(coordinates: number[]) {
  return `${columns[coordinates[0]]}${rows[coordinates[1]]}`
}

function gcd(a: number, b: number) {
  a = Math.abs(a)
  b = Math.abs(b)
  if(a === 0) { return b}
  if(b === 0) { return a}

  return gcd(b, a % b)
}

interface Piece {
  type: string;
  color: "LIGHT" | "DARK";
}

export default ChessBoard;
