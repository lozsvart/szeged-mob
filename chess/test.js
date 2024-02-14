import { it } from "node:test";
import assert from "node:assert";
import ChessBoard from "./ChessBoard.js";

it("empty board should have zero pieces", () => {
  assert.strictEqual(0, new ChessBoard().countPieces())
});
