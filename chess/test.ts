import { it } from "node:test";
import assert from "node:assert";
import ChessBoard from "./ChessBoard.ts";

it("empty board should have zero pieces", () => {
  assert.strictEqual(0, new ChessBoard().countPieces());
});

it("empty board should have 64 empty fields", () => {
  assert.strictEqual(64, new ChessBoard().countEmptyFields());
});
