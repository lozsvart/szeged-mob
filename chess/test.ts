import { describe, it } from "node:test";
import assert from "node:assert";
import ChessBoard from "./ChessBoard.ts";

function createEmptyBoard() {
  return new ChessBoard();
}

it("empty board should have zero pieces", () => {
  assert.strictEqual(createEmptyBoard().countPieces(), 0);
});

it("empty board should have 64 empty fields", () => {
  assert.strictEqual(createEmptyBoard().countEmptyFields(), 64);
});

describe("count piece", () => {
  // Given an empty board
  // When I put a piece on "A1"
  // Then piece count should be 1
  it("should return 1 when putting a piece on an empty board", () => {
    const board = createEmptyBoard();

    board.putPiece("A1");

    assert.strictEqual(board.countPieces(), 1);
  });

  // Given a board with a piece on "A1"
  // When I put a piece on "A2"
  // Then piece count should be 2
  it("should return 2 when putting a piece on a board which already has a piece on it", () => {
    const board = createEmptyBoard();
    board.putPiece("A1");

    board.putPiece("A2");

    assert.strictEqual(board.countPieces(), 2);
  });

  // Given a board with a piece on "A1"
  // When I put a piece on "A1"
  // Then piece count should be 1
  it("should return 1 when putting a piece on another piece", () => {
    const board = createEmptyBoard();
    board.putPiece("A1");

    board.putPiece("A1");

    assert.strictEqual(board.countPieces(), 1);
  });
});

describe("rook movement", () => {
  it("should be able to move to 14 fields", () => {
    const board = createEmptyBoard();
    putPiece(board, "A1", "Rook");

    assert.strictEqual(board.getMoveOptionCount("A1"), 14);
  });

  it("should be able to move on to specific fields", () => {
    const board = createEmptyBoard();
    putPiece(board, "A1", "Rook");
    const expectedValue = new Set([
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
    ])

    assert.deepStrictEqual(board.getMoveOptions("A1"), expectedValue);
  });

  it("shouldn't be able to go through another piece in a row", () => {

    const board = createEmptyBoard();
    putPiece(board, "A1", "Rook");
    putPiece(board, "F1", "Rook");

    const expectedValue = new Set([
      "B1",
      "C1",
      "D1",
      "E1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
    ])

    assert.deepStrictEqual(board.getMoveOptions("A1"), expectedValue);

  })

  it("shouldn't be able to go through another piece in a column", () => {

    const board = createEmptyBoard();
    putPiece(board, "A1", "Rook");
    putPiece(board, "A5", "Rook");

    const expectedValue = new Set([
      "A2",
      "A3",
      "A4",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
    ])

    assert.deepStrictEqual(board.getMoveOptions("A1"), expectedValue);
  })

  it("shouldn't be able to go through another piece in a row - in a different row", () => {
    const board = createEmptyBoard();
    putPiece(board, "A2", "Rook");
    putPiece(board, "F2", "Rook");

    assert.equal(board.getMoveOptions("A2").size, 11);
  })

});



function putPiece(board: ChessBoard, location: string, pieceType: string) {
  board.putPiece(location, pieceType);
}
