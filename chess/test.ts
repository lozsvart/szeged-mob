import { describe, it } from "node:test";
import assert from "node:assert";
import ChessBoard from "./ChessBoard.ts";

function createEmptyBoard() {
  return new ChessBoard();
}

function createBoardWithRooks(...locations: string[]) {
  const board = new ChessBoard();
  locations.forEach((location) => putPiece(board, location, "Rook", "light"));

  return board;
}

function createBoardWithColoredRooks(
  lightLocations: string[],
  darkLocations: string[]
) {
  return createBoardWithColoredPieces(lightLocations, darkLocations, "Rook");
}

function createBoardWithColoredBishops(
  lightLocations: string[],
  darkLocations: string[]
) {
  return createBoardWithColoredPieces(lightLocations, darkLocations, "Bishop");
}

function createBoardWithColoredPieces(
  lightLocations: string[],
  darkLocations: string[],
  pieceType: string
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

it("empty board should have zero pieces", () => {
  assert.strictEqual(createEmptyBoard().countPieces(), 0);
});

it("empty board should have 64 empty fields", () => {
  assert.strictEqual(createEmptyBoard().countEmptyFields(), 64);
});

describe("count piece", () => {
  it("should return 1 when putting a piece on an empty board", () => {
    const board = createBoardWithRooks("A1");
    assert.strictEqual(board.countPieces(), 1);
  });

  it("should return 2 when putting a piece on a board which already has a piece on it", () => {
    const board = createBoardWithRooks("A1", "A2");
    assert.strictEqual(board.countPieces(), 2);
  });

  it("should return 1 when putting a piece on another piece", () => {
    const board = createBoardWithRooks("A1");
    board.putPiece("A1");
    assert.strictEqual(board.countPieces(), 1);
  });
});

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
        const board = createBoardWithColoredRooks(
          lightLocations,
          darkLocations
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
      const board = createBoardWithRooks(...locations);
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
      const board = createBoardWithColoredRooks(lightLocations, darkLocations);

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
        const board = createBoardWithColoredBishops(
          lightLocations,
          darkLocations
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
  pieceType: string,
  color: string
) {
  board.putPiece(location, pieceType, color);
}
