import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'node:assert'
import ChessBoard from '../../ChessBoard';

let board: ChessBoard;
let queryResult: any;

Given('I have an empty board', function () {
    board = new ChessBoard()
});

Given('I have a board with a piece on {string}', function (location) {
    board = new ChessBoard()
    board.putPiece(location)
});

Given('I have a board with a {string} on {string}', function (piece, location) {
    board = new ChessBoard()
    board.putPiece(location, piece)
});

When('I put a piece on {string}', function (location) {
    board.putPiece(location)
});

When('I query the fields the piece on {string} is able to move', function (location) {
    queryResult = board.getMoveOptions(location)
});

Then('the result should contain {int} elements', function (count) {
    let resultItems = queryResult as Array<String>;
    assert.strictEqual(resultItems.length, count);
});

Then('I should have {int} piece(s) on the board', function (count) {
    assert.strictEqual(board.countPieces(), count)
});

Then('the result should contain all of {string} as elements', function (elements: String) {
    let fields = queryResult as Array<String>;
    let expected = elements.split(",").map(element => element.trim())
    assert.strictEqual(expected.every(element => fields.includes(element)), true,
        "All of " + elements + " should be in " + fields)
});

Then('the result should contain none of {string} as elements', function (elements: String) {
    let fields = queryResult as Array<String>;
    let expected = elements.split(",").map(element => element.trim())
    assert.strictEqual(expected.every(element => !fields.includes(element)), true,
        "None of " + elements + " should be in " + fields)
})