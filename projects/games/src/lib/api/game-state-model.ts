import {Player} from "./player";
import {IPlayerScore} from "./player-score";

export interface IGameStateModel {
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  scores: IPlayerScore;
}
