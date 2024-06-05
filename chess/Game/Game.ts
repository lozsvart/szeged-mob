import { MovementError } from "../ChessBoard";

class Game {
  constructor() {}

  move(startLocation: string, targetLocation: string) {
    throw new TurnError();
  }
}

export class TurnError extends Error {}

export default Game;
