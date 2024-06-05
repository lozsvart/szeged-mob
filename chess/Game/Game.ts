import { MovementError } from "../ChessBoard";

class Game {
  constructor() {}

  move(startLocation: string, targetLocation: string) {
    throw MovementError;
  }
}

export default Game;
