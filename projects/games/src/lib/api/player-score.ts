import { Player } from "./player";

export interface IPlayerScore {
  [Player.PLAYER1]: number;
  [Player.PLAYER2]: number;
}
