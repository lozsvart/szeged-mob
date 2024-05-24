import { describe, it } from "node:test";
import assert from "node:assert";
import ChessBoard, { PieceType } from "./ChessBoard";

function putPiece(
  board: ChessBoard,
  location: string,
  pieceType: PieceType,
  color: string
) {
  board.putPiece(location, pieceType, color);
}

function createBoardWithColoredPieces(
  lightLocations: string[],
  darkLocations: string[],
  pieceType: PieceType
) {
  const board = new ChessBoard();
  lightLocations.forEach((lightLocation) =>
    putPiece(board, lightLocation, pieceType, "light")
  );
  darkLocations.forEach((darkLocation) =>
    putPiece(board, darkLocation, pieceType, "dark")
  );

  return board;
}

describe("movement", () => {
  [
    {
      lightLocations: ["A1"],
      shouldContain: ["A2", "A8", "B1", "H1"],
      shouldNotContain: ["B2", "A1"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["A1", "F1"],
      shouldContain: ["E1"],
      shouldNotContain: ["F1", "G1"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["A1", "A5"],
      shouldContain: ["A4"],
      shouldNotContain: ["A5", "A6"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["A1"],
      darkLocations: ["A2"],
      shouldContain: ["A2"],
      shouldNotContain: ["A3"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["C1"],
      shouldContain: ["B2", "A3", "D2", "H6"],
      shouldNotContain: ["B1", "D1", "C2"],
      movingFrom: "C1",
      pieceType: PieceType.BISHOP,
      description: "",
    },
    {
      lightLocations: ["C1", "B1", "D2", "C2"],
      shouldContain: ["B2", "A3"],
      shouldNotContain: ["B1", "D1", "C2", "E3", "H6"],
      movingFrom: "C1",
      pieceType: PieceType.BISHOP,
      description: "",
    },
    {
      lightLocations: ["A1"],
      shouldContain: ["A8", "H1", "H8", "A2", "B2", "B1"],
      shouldNotContain: ["B3", "C2", "H2", "B8", "H7", "G8"],
      movingFrom: "A1",
      pieceType: PieceType.QUEEN,
      description: "",
    },
    {
      lightLocations: ["C3"],
      shouldContain: ["A4", "A2", "B5", "D5", "E4", "E2", "B1", "D1"],
      movingFrom: "C3",
      movementOptionCount: 8,
      pieceType: PieceType.KNIGHT,
      description: "",
    },
    {
      lightLocations: ["C3", "A4"],
      darkLocations: ["B4", "C4", "D5"],
      shouldContain: ["D5", "B5"],
      movingFrom: "C3",
      movementOptionCount: 7,
      pieceType: PieceType.KNIGHT,
      description: "",
    },
    {
      lightLocations: ["E5", "D4", "E4", "F4"],
      shouldContain: ["F5", "F6", "E6", "D6", "D5"],
      shouldNotContain: ["E5", "D4", "E4", "F4", "G5", "C7", "D3"],
      movingFrom: "E5",
      pieceType: PieceType.KING,
      description: "",
    },
    {
      lightLocations: ["A2", "F2"],
      movingFrom: "A2",
      movementOptionCount: 11,
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["A1", "A2"],
      movingFrom: "A1",
      movementOptionCount: 7,
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["F1", "E1"],
      movingFrom: "F1",
      movementOptionCount: 9,
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["F1", "E1", "F5"],
      movingFrom: "F1",
      movementOptionCount: 5,
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      lightLocations: ["D4", "E3", "E5", "F4", "E4"],
      movingFrom: "E4",
      movementOptionCount: 0,
      pieceType: PieceType.ROOK,
      description: "",
    },
    {
      darkLocations: ["E5"],
      shouldContain: ["E4"],
      shouldNotContain: ["E6"],
      movingFrom: "E5",
      pieceType: PieceType.PAWN,
      description: "",
    },
    {
      lightLocations: ["E5"],
      shouldContain: ["E6"],
      shouldNotContain: ["E4"],
      movingFrom: "E5",
      pieceType: PieceType.PAWN,
      description: "",
    },
    {
      lightLocations: ["E4"],
      darkLocations: ["E5"],
      movingFrom: "E5",
      movementOptionCount: 0,
      pieceType: PieceType.PAWN,
      description: "",
    },
    {
      lightLocations: ["E4"],
      darkLocations: ["D5"],
      movingFrom: "E4",
      shouldContain: ["D5", "E5"],
      pieceType: PieceType.PAWN,
      description: "",
    },
    {
      lightLocations: ["A2"],
      movingFrom: "A2",
      shouldContain: ["A4"],
      shouldNotContain: ["A5"],
      pieceType: PieceType.PAWN,
      description: "",
    },
  ].forEach(
    ({
      lightLocations = [],
      darkLocations = [],
      shouldContain = [],
      shouldNotContain = [],
      movingFrom,
      pieceType,
      movementOptionCount,
      description,
    }) =>
      it(`${pieceType} should be able to move from ${movingFrom} to ${shouldContain} fields, ${description}`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations,
          darkLocations,
          pieceType
        );
        const actual = board.getMoveOptions(movingFrom);

        for (let containedElement of shouldContain) {
          assert(
            actual.has(containedElement),
            `${containedElement} should be a valid movement`
          );
        }

        for (let notContainedElement of shouldNotContain) {
          assert(
            !actual.has(notContainedElement),
            `${notContainedElement} should NOT be a valid movement`
          );
        }

        if (movementOptionCount === 0 || movementOptionCount) {
          assert(
            actual.size === movementOptionCount,
            `There should be ${movementOptionCount} movement options, but received ${actual.size}`
          );
        }
      })
  );
});
