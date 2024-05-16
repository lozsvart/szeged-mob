import { describe, it } from "node:test";
import assert from "node:assert";
import ChessBoard, { PieceType } from "./ChessBoard";

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

describe("rook movement", () => {
  [
    {
      lightLocations: ["A1"],
      darkLocations: [],
      shouldContain: ["A2", "A8", "B1", "H1"],
      shouldNotContain: ["B2", "A1"],
      movingFrom: "A1",
    },
    {
      lightLocations: ["A1", "F1"],
      darkLocations: [],
      shouldContain: ["E1"],
      shouldNotContain: ["F1", "G1"],
      movingFrom: "A1",
    },
    {
      lightLocations: ["A1", "A5"],
      darkLocations: [],
      shouldContain: ["A4"],
      shouldNotContain: ["A5", "A6"],
      movingFrom: "A1",
    },
    {
      lightLocations: ["A1"],
      darkLocations: ["A2"],
      shouldContain: ["A2"],
      shouldNotContain: ["A3"],
      movingFrom: "A1",
    },
  ].forEach(
    ({
      lightLocations,
      darkLocations,
      shouldContain,
      shouldNotContain,
      movingFrom,
    }) =>
      it(`should be able to move from ${movingFrom} to ${shouldContain} fields`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations,
          darkLocations,
          PieceType.ROOK
        );
        const actual = board.getMoveOptions(movingFrom);

        for (let containedElement of shouldContain) {
          assert(actual.has(containedElement));
        }

        for (let notContainedElement of shouldNotContain) {
          assert(!actual.has(notContainedElement));
        }
      })
  );

  [
    { locations: ["A2", "F2"], rookToMove: "A2", moveOptionCount: 11 },
    { locations: ["A1", "A2"], rookToMove: "A1", moveOptionCount: 7 },
    { locations: ["F1", "E1"], rookToMove: "F1", moveOptionCount: 9 },
    { locations: ["F1", "E1", "F5"], rookToMove: "F1", moveOptionCount: 5 },
    {
      locations: ["D4", "E3", "E5", "F4", "E4"],
      rookToMove: "E4",
      moveOptionCount: 0,
    },
  ].forEach(({ locations, rookToMove, moveOptionCount }) =>
    it(`should return correct move options count when moving ${rookToMove} when there are rooks at ${locations}`, () => {
      const board = createBoardWithColoredPieces(locations, [], PieceType.ROOK);
      assert.equal(board.getMoveOptions(rookToMove).size, moveOptionCount);
    })
  );

  [
    {
      lightLocations: ["A1"],
      darkLocations: ["A3"],
      rookToMove: "A1",
      moveOptionCount: 9,
    },
    {
      lightLocations: ["A3"],
      darkLocations: ["A1"],
      rookToMove: "A1",
      moveOptionCount: 9,
    },
  ].forEach(({ lightLocations, darkLocations, rookToMove, moveOptionCount }) =>
    it(`should return correct move options count when moving ${rookToMove} when there are light rooks at ${lightLocations} and dark rooks at ${darkLocations}`, () => {
      const board = createBoardWithColoredPieces(
        lightLocations,
        darkLocations,
        PieceType.ROOK
      );

      assert.equal(board.getMoveOptions(rookToMove).size, moveOptionCount);
    })
  );
});

describe("bishop movement", () => {
  [
    {
      lightLocations: ["C1"],
      darkLocations: [],
      shouldContain: ["B2", "A3", "D2", "H6"],
      shouldNotContain: ["B1", "D1", "C2"],
      movingFrom: "C1",
    },
    {
      lightLocations: ["C1", "B1", "D2", "C2"],
      darkLocations: [],
      shouldContain: ["B2", "A3"],
      shouldNotContain: ["B1", "D1", "C2", "E3", "H6"],
      movingFrom: "C1",
    },
  ].forEach(
    ({
      lightLocations,
      darkLocations,
      shouldContain,
      shouldNotContain,
      movingFrom,
    }) =>
      it(`should be able to move from ${movingFrom} to ${shouldContain} fields`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations,
          darkLocations,
          PieceType.BISHOP
        );
        const actual = board.getMoveOptions(movingFrom);

        for (let containedElement of shouldContain) {
          assert(actual.has(containedElement));
        }

        for (let notContainedElement of shouldNotContain) {
          assert(!actual.has(notContainedElement));
        }
      })
  );
});

describe("queen movement", () => {
  [
    {
      lightLocations: ["A1"],
      darkLocations: [],
      shouldContain: ["A8", "H1", "H8", "A2", "B2", "B1"],
      shouldNotContain: ["B3", "C2", "H2", "B8", "H7", "G8"],
      movingFrom: "A1",
    },
  ].forEach(
    ({
      lightLocations,
      darkLocations,
      shouldContain,
      shouldNotContain,
      movingFrom,
    }) =>
      it(`should be able to move from ${movingFrom} to ${shouldContain} fields`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations,
          darkLocations,
          PieceType.QUEEN
        );
        const actual = board.getMoveOptions(movingFrom);

        for (let containedElement of shouldContain) {
          assert(actual.has(containedElement));
        }

        for (let notContainedElement of shouldNotContain) {
          assert(!actual.has(notContainedElement));
        }
      })
  );
});

describe("knight movement", () => {
  [
    {
      lightLocations: ["C3"],
      darkLocations: [],
      shouldContain: ["A4", "A2", "B5", "D5", "E4", "E2", "B1", "D1"],
      movingFrom: "C3",
      movementOptionCount: 8,
    },
    {
      lightLocations: ["C3", "A4"],
      darkLocations: ["B4", "C4", "D5"],
      shouldContain: ["D5", "B5"],
      movingFrom: "C3",
      movementOptionCount: 7,
    },
  ].forEach(
    ({
      lightLocations,
      darkLocations,
      shouldContain,
      movingFrom,
      movementOptionCount,
    }) =>
      it(`should be able to move from ${movingFrom} to ${shouldContain} fields`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations,
          darkLocations,
          PieceType.KNIGHT
        );
        const actual = board.getMoveOptions(movingFrom);

        for (let containedElement of shouldContain) {
          assert(actual.has(containedElement));
        }

        assert(actual.size === movementOptionCount);
      })
  );
});

describe("king movement", () => {
  [
    {
      lightLocations: ["E5", "D4", "E4", "F4"],
      darkLocations: [],
      shouldContain: ["F5", "F6", "E6", "D6", "D5"],
      shouldNotContain: ["E5", "D4", "E4", "F4", "G5", "C7", "D3"],
      movingFrom: "E5",
    },
  ].forEach(
    ({
      lightLocations,
      darkLocations,
      shouldContain,
      shouldNotContain,
      movingFrom,
    }) =>
      it(`should be able to move from ${movingFrom} to ${shouldContain} fields`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations,
          darkLocations,
          PieceType.KING
        );
        const actual = board.getMoveOptions(movingFrom);

        for (let containedElement of shouldContain) {
          assert(actual.has(containedElement));
        }

        for (let notContainedElement of shouldNotContain) {
          assert(!actual.has(notContainedElement));
        }
      })
  );
});

describe("pawn movement", () => {
  [
    {
      lightLocations: ["E4"],
      darkLocations: ["E6"],
      shouldContain: ["E5"],
      shouldNotContain: ["E4", "E6"],
      movingFrom: "E4",
    },
    {
      lightLocations: ["E4"],
      darkLocations: ["E6"],
      shouldContain: ["E5"],
      shouldNotContain: ["E4", "E6"],
      movingFrom: "E6",
    },
    {
      lightLocations: ["E4", "D5"],
      darkLocations: ["F5"],
      shouldContain: ["F5"],
      shouldNotContain: ["F3", "D5"],
      movingFrom: "E4",
    },
  ].forEach(
    ({
      lightLocations,
      darkLocations,
      shouldContain,
      shouldNotContain,
      movingFrom,
    }) =>
      it(`should be able to move from ${movingFrom} to ${shouldContain} fields`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations,
          darkLocations,
          PieceType.PAWN
        );
        const actual = board.getMoveOptions(movingFrom);

        for (let containedElement of shouldContain) {
          assert(actual.has(containedElement));
        }

        for (let notContainedElement of shouldNotContain) {
          assert(!actual.has(notContainedElement));
        }
      })
  );
});

function putPiece(
  board: ChessBoard,
  location: string,
  pieceType: PieceType,
  color: string
) {
  board.putPiece(location, pieceType, color);
}
