import { describe, it } from "node:test";
import assert from "node:assert";
import ChessBoard, {
  PieceType,
  MovementError,
  PieceColor,
  Location,
  Piece,
  CheckError,
  GameState,
} from "../ChessBoard";
import Game from "../Game";
import { TurnError } from "../Game/Game";

interface Scenario {
  lightLocations?: Array<Location>;
  darkLocations?: Array<Location>;
  shouldContain?: Array<Location>;
  shouldNotContain?: Array<Location>;
  movingFrom: Location;
  pieceType: PieceType;
  movementOptionCount?: number;
  description: string;
}

function putPiece(
  board: ChessBoard,
  location: Location,
  pieceType: PieceType,
  color: PieceColor
) {
  board.putPiece(location, pieceType, color);
}

function createBoardWithColoredPieces(
  lightLocations: Location[],
  darkLocations: Location[],
  pieceType: PieceType
) {
  const board = new ChessBoard();
  lightLocations.forEach((lightLocation) =>
    putPiece(board, lightLocation, pieceType, "LIGHT")
  );
  darkLocations.forEach((darkLocation) =>
    putPiece(board, darkLocation, pieceType, "DARK")
  );

  return board;
}

const createGameWithPieces = (pieces: Partial<Record<Location, Piece>>) =>
  new Game(pieces);

describe("Board Movement", () => {
  const boardMovementScenarios: Array<Scenario> = [
    {
      lightLocations: ["A1"],
      shouldContain: ["A2", "A8", "B1", "H1"],
      shouldNotContain: ["B2", "A1"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description: "Rook should be able to move parallel to axes",
    },
    {
      lightLocations: ["A1", "F1"],
      shouldContain: ["E1"],
      shouldNotContain: ["F1", "G1"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description:
        "Rook should not be able to jump on or over piece with same color",
    },
    {
      lightLocations: ["A1", "A5"],
      shouldContain: ["A4"],
      shouldNotContain: ["A5", "A6"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description:
        "Rook should not be able to jump on or over piece with same color",
    },
    {
      lightLocations: ["A1"],
      darkLocations: ["A2"],
      shouldContain: ["A2"],
      shouldNotContain: ["A3"],
      movingFrom: "A1",
      pieceType: PieceType.ROOK,
      description:
        "Rook should be able to capture, but not jump over enemy pieces",
    },
    {
      lightLocations: ["C1"],
      shouldContain: ["B2", "A3", "D2", "H6"],
      shouldNotContain: ["B1", "D1", "C2"],
      movingFrom: "C1",
      pieceType: PieceType.BISHOP,
      description: "Bishop should be able to move diagonally",
    },
    {
      lightLocations: ["C1", "B1", "D2", "C2"],
      shouldContain: ["B2", "A3"],
      shouldNotContain: ["B1", "D1", "C2", "E3", "H6"],
      movingFrom: "C1",
      pieceType: PieceType.BISHOP,
      description:
        "Bishop should not be able to jump on or over pieces with same color",
    },
    {
      lightLocations: ["A1"],
      shouldContain: ["A8", "H1", "H8", "A2", "B2", "B1"],
      shouldNotContain: ["B3", "C2", "H2", "B8", "H7", "G8"],
      movingFrom: "A1",
      pieceType: PieceType.QUEEN,
      description:
        "Queen should be able to move parallel to axes or diagonally",
    },
    {
      lightLocations: ["C3"],
      shouldContain: ["A4", "A2", "B5", "D5", "E4", "E2", "B1", "D1"],
      movingFrom: "C3",
      movementOptionCount: 8,
      pieceType: PieceType.KNIGHT,
      description:
        "Knight should be able to move 1 square horizontally, 2 vertically or vice versa",
    },
    {
      lightLocations: ["C3", "A4"],
      darkLocations: ["B4", "C4", "D5"],
      shouldContain: ["D5", "B5"],
      movingFrom: "C3",
      movementOptionCount: 7,
      pieceType: PieceType.KNIGHT,
      description:
        "Knight should be able to jump over pieces but not on piece with same color",
    },
    {
      lightLocations: ["E5", "D4", "E4", "F4"],
      shouldContain: ["F5", "F6", "E6", "D6", "D5"],
      shouldNotContain: ["E5", "D4", "E4", "F4", "G5", "C7", "D3"],
      movingFrom: "E5",
      pieceType: PieceType.KING,
      description:
        "King should be able to move to adjacent squares, but not on pieces with same color",
    },
    {
      lightLocations: ["A2", "F2"],
      movingFrom: "A2",
      movementOptionCount: 11,
      pieceType: PieceType.ROOK,
      description: "Rook should not be able to jump over pieces",
    },
    {
      lightLocations: ["A1", "A2"],
      movingFrom: "A1",
      movementOptionCount: 7,
      pieceType: PieceType.ROOK,
      description: "Rook should not be able to jump over pieces",
    },
    {
      lightLocations: ["F1", "E1"],
      movingFrom: "F1",
      movementOptionCount: 9,
      pieceType: PieceType.ROOK,
      description: "Rook should not be able to jump over pieces",
    },
    {
      lightLocations: ["F1", "E1", "F5"],
      movingFrom: "F1",
      movementOptionCount: 5,
      pieceType: PieceType.ROOK,
      description: "Rook should not be able to jump over pieces",
    },
    {
      lightLocations: ["D4", "E3", "E5", "F4", "E4"],
      movingFrom: "E4",
      movementOptionCount: 0,
      pieceType: PieceType.ROOK,
      description:
        "Rook should not be able to jump over pieces in any direction",
    },
    {
      darkLocations: ["E5"],
      shouldContain: ["E4"],
      shouldNotContain: ["E6"],
      movingFrom: "E5",
      pieceType: PieceType.PAWN,
      description: "Dark pawn should not be able to move down, but not up",
    },
    {
      lightLocations: ["E5"],
      shouldContain: ["E6"],
      shouldNotContain: ["E4"],
      movingFrom: "E5",
      pieceType: PieceType.PAWN,
      description: "Light pawn should be able to move up, but not down",
    },
    {
      lightLocations: ["E4"],
      darkLocations: ["E5"],
      movingFrom: "E5",
      movementOptionCount: 0,
      pieceType: PieceType.PAWN,
      description:
        "Pawn should not be able to move when blocked by a piece in front of it",
    },
    {
      lightLocations: ["E4"],
      darkLocations: ["D5"],
      movingFrom: "E4",
      shouldContain: ["D5", "E5"],
      pieceType: PieceType.PAWN,
      description:
        "Pawn should be able to either move forward or capture diagonally",
    },
    {
      lightLocations: ["A2"],
      movingFrom: "A2",
      shouldContain: ["A4"],
      shouldNotContain: ["A5"],
      pieceType: PieceType.PAWN,
      description:
        "Pawn should be able to move forward two squares from the starting position",
    },
  ];

  boardMovementScenarios.forEach(
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
      it(`${description}`, () => {
        const board = createBoardWithColoredPieces(
          lightLocations as Array<Location>,
          darkLocations as Array<Location>,
          pieceType
        );
        const actual = board.getMoveOptions(movingFrom as Location);

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

describe("Piece Movements", () => {
  it("Moving a piece should not change pieceCount", () => {
    const board = createBoardWithColoredPieces(["A1"], [], PieceType.ROOK);
    board.movePiece("A1", "A3");
    assert(board.countPieces() === 1, "The board should have 1 piece on it");
  });

  it("Moving a piece from an empty field should throw an exception", () => {
    const board = createBoardWithColoredPieces([], [], PieceType.ROOK);
    assert.throws(
      () => board.movePiece("A1", "A3"),
      MovementError,
      "Movement from an empty field should not be allowed"
    );
  });

  it("Should throw an exception when trying to move onto a piece with the same color", () => {
    const board = createBoardWithColoredPieces(
      ["A1", "A3"],
      [],
      PieceType.ROOK
    );
    assert.throws(
      () => board.movePiece("A1", "A3"),
      MovementError,
      "Movement onto a piece with the same should not be allowed"
    );
  });

  it("Should allow capturing another piece with a different color", () => {
    const board = createBoardWithColoredPieces(["A1"], ["A3"], PieceType.ROOK);
    board.movePiece("A1", "A3");
    assert(board.countPieces() === 1, "The board should have 1 piece on it");
  });
});

const createDefaultGame = () => Game.defaultGame();

describe("Turns", () => {
  it("Black should not be allowed to start the game", () => {
    const game = createDefaultGame();

    assert.throws(
      () => game.move("D7", "D6"),
      TurnError,
      "Black should not be allowed to move at the start"
    );
  });

  it("White should be able to move at the start of the game", () => {
    const game = createDefaultGame();

    assert.doesNotThrow(
      () => game.move("D2", "D3"),
      TurnError,
      "White should be able to move at the start of the game"
    );
  });

  it("Movement should be reflected in the next turn", () => {
    const game = createDefaultGame();
    game.move("D2", "D3");

    assert.throws(
      () => game.move("D2", "D3"),
      MovementError,
      "There should be no pieces on D2"
    );
  });

  it("Turns should be alternating", () => {
    const game = createDefaultGame();

    assert.doesNotThrow(
      () => game.move("D2", "D3"),
      TurnError,
      "White should be able to move at the start of the game"
    );

    assert.doesNotThrow(
      () => game.move("D7", "D6"),
      TurnError,
      "Black should be able to move in the second turn"
    );

    assert.doesNotThrow(
      () => game.move("C2", "C3"),
      TurnError,
      "White should be able to move in the third turn"
    );
  });
});

describe("Game movement", () => {
  it("should not let the King to move into check", () => {
    const game = createGameWithPieces({
      A1: { type: PieceType.KING, color: "LIGHT" },
      B2: { type: PieceType.ROOK, color: "DARK" },
    });

    assert.throws(
      () => game.move("A1", "A2"),
      CheckError,
      "The king should not be able to move into check"
    );
  });
  it("same color should not be able to check King", () => {
    const game = createGameWithPieces({
      A1: { type: PieceType.KING, color: "LIGHT" },
      B3: { type: PieceType.ROOK, color: "DARK" },
      C3: { type: PieceType.KING, color: "DARK" },
    });
    assert.doesNotThrow(
      () => game.move("A1", "A2"),
      CheckError,
      "Same color should not be able to check King"
    );
  });
  it("movement with own piece should not allow discovered check", () => {
    const game = createGameWithPieces({
      C6: { type: PieceType.KING, color: "LIGHT" },
      C5: { type: PieceType.ROOK, color: "LIGHT" },
      C3: { type: PieceType.ROOK, color: "DARK" },
    });
    assert.throws(
      () => game.move("C5", "D5"),
      CheckError,
      "Movement with own piece should not allow discovered check"
    );
  });
  it("Should revert movement after trying to move into a check", () => {
    const game = createGameWithPieces({
      C6: { type: PieceType.KING, color: "LIGHT" },
      C5: { type: PieceType.ROOK, color: "LIGHT" },
      C3: { type: PieceType.ROOK, color: "DARK" },
    });
    assert.throws(
      () => game.move("C5", "D5"),
      CheckError,
      "King should be in check"
    );
    assert.doesNotThrow(
      () => game.move("C5", "C4"),
      Error,
      "King should be able to move after reverting the previous movement"
    );
  });
});

describe("Game status", () => {
  it("Should end game with check-mate", () => {
    const game = createGameWithPieces({
      A1: { type: PieceType.KING, color: "LIGHT" },
      C2: { type: PieceType.ROOK, color: "DARK" },
      D1: { type: PieceType.ROOK, color: "DARK" },
      D2: { type: PieceType.KING, color: "DARK" },
    });

    assert.strictEqual(
      game.getState(),
      GameState.BLACK_WON,
      "Black should be the winner."
    );
  });

  it("Should not end game when white King can get out of check via capture", () => {
    const game = createGameWithPieces({
      A1: { type: PieceType.KING, color: "LIGHT" },
      B2: { type: PieceType.ROOK, color: "DARK" },
      D1: { type: PieceType.ROOK, color: "DARK" },
      D2: { type: PieceType.KING, color: "DARK" },
    });

    assert.strictEqual(
      game.getState(),
      GameState.WHITE_TO_MOVE,
      "White should be able to move."
    );
  });

  it("Should not end game when white is able to capture checking piece", () => {
    const game = createGameWithPieces({
      A1: { type: PieceType.KING, color: "LIGHT" },
      C2: { type: PieceType.ROOK, color: "DARK" },
      D1: { type: PieceType.ROOK, color: "DARK" },
      D2: { type: PieceType.KING, color: "DARK" },
      E1: { type: PieceType.ROOK, color: "LIGHT" },
    });

    assert.strictEqual(
      game.getState(),
      GameState.WHITE_TO_MOVE,
      "White should be able to move."
    );
  });

  it("Should not end game when white is able to move in front of checking piece", () => {
    const game = createGameWithPieces({
      A1: { type: PieceType.KING, color: "LIGHT" },
      C2: { type: PieceType.ROOK, color: "DARK" },
      D1: { type: PieceType.ROOK, color: "DARK" },
      D2: { type: PieceType.KING, color: "DARK" },
      B3: { type: PieceType.ROOK, color: "LIGHT" },
    });

    assert.strictEqual(
      game.getState(),
      GameState.WHITE_TO_MOVE,
      "White should be able to move."
    );
  });

  it("Should end game when it is a stalemate", () => {
    const game = createGameWithPieces({
      A1: { type: PieceType.KING, color: "LIGHT" },
      C2: { type: PieceType.ROOK, color: "DARK" },
      B3: { type: PieceType.ROOK, color: "DARK" },
      D2: { type: PieceType.KING, color: "DARK" },
    });

    assert.strictEqual(
      game.getState(),
      GameState.STALEMATE,
      "It should be a stalemate."
    );
  });

  it("Should end game when white gives a checkmate", () => {
    const game = createGameWithPieces({
      C3: { type: PieceType.KING, color: "LIGHT" },
      C2: { type: PieceType.QUEEN, color: "LIGHT" },
      A1: { type: PieceType.KING, color: "DARK" },
    });

    game.move("C2", "B2");

    assert.strictEqual(
      game.getState(),
      GameState.WHITE_WON,
      "White should be the winner."
    );
  });
});

describe("Full game", () => {
  it("Fool's mate", () => {
    const game = Game.defaultGame();

    game.move("F2", "F3");
    game.move("E7", "E6");

    game.move("G2", "G4");
    game.move("D8", "H4");

    assert.strictEqual(
      game.getState(),
      GameState.BLACK_WON,
      "Black should be the winner."
    );
  });

  it("'Immortal Game' played between Adolf Anderssen and Lionel Kieseritzky in 1851", () => {
    const game = Game.defaultGame();

    game.move("E2", "E4");
    game.move("E7", "E5");
    game.move("F2", "F4");
    game.move("E5", "F4");
    game.move("F1", "C4");
    game.move("D8", "H4");
    game.move("E1", "F1");
    game.move("B7", "B5");
    game.move("C4", "B5");
    game.move("G8", "F6");
    game.move("G1", "F3");
    game.move("H4", "H6");
    game.move("D2", "D3");
    game.move("F6", "H5");
    game.move("F3", "H4");
    game.move("H6", "G5");
    game.move("H4", "F5");
    game.move("C7", "C6");
    game.move("G2", "G4");
    game.move("H5", "F6");
    game.move("H1", "G1");
    game.move("C6", "B5");
    game.move("H2", "H4");
    game.move("G5", "G6");
    game.move("H4", "H5");
    game.move("G6", "G5");
    game.move("D1", "F3");
    game.move("F6", "G8");
    game.move("C1", "F4");
    game.move("G5", "F6");
    game.move("B1", "C3");
    game.move("F8", "C5");
    game.move("C3", "D5");
    game.move("F6", "B2");
    game.move("F4", "D6");
    game.move("C5", "G1");
    game.move("E4", "E5");
    game.move("B2", "A1");
    game.move("F1", "E2");
    game.move("B8", "A6");
    game.move("F5", "G7");
    game.move("E8", "D8");
    game.move("F3", "F6");
    game.move("G8", "F6");
    game.move("D6", "E7");

    assert.strictEqual(
      game.getState(),
      GameState.WHITE_WON,
      "White should be the winner."
    );
  });
});
