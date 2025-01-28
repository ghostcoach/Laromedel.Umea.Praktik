import {Injectable} from "@angular/core";
import {GameState} from "./game-state";
import {Selector} from "@ngxs/store";
import {IGameStateModel} from "../api/game-state-model";
import {Player} from "../api/player";

@Injectable()
export class GameStateQueries {
  @Selector([GameState])
  public static isGameOver$(state: IGameStateModel): boolean {
    return state.gameOver;
  }

  @Selector([GameState])
  public static winner$(state: IGameStateModel): string {
    return state.winner === null ? "Oavgjort" : state.winner;
  }

  @Selector([GameState])
  public static currentPlayer$(state: IGameStateModel): Player {
    return state.currentPlayer;
  }

  @Selector([GameState])
  public static player1Score$(state: IGameStateModel): number {
    return state.scores[Player.PLAYER1];
  }

  @Selector([GameState])
  public static player2Score$(state: IGameStateModel): number {
    return state.scores[Player.PLAYER2];
  }
}
