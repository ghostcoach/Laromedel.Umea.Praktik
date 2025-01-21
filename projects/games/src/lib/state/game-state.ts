import {IGameStateModel} from "../api/game-state-model";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {Player} from "../api/player";
import {DeclareWinner, IncrementScoreForCurrentPlayer, ResetGameState, SetGameOver, ToggleCurrentPlayer} from "./game-state-actions";

const stateToken: StateToken<IGameStateModel> = new StateToken<IGameStateModel>("gameState");
const defaultState: IGameStateModel = {
  currentPlayer: Player.PLAYER1,
  gameOver: false,
  winner: null,
  scores: {
    [Player.PLAYER1]: 0,
    [Player.PLAYER2]: 0,
  },
};

@UntilDestroy()
@State({
  name: stateToken,
  defaults: defaultState,
})
@Injectable()
export class GameState {
  public gameOverTimeout: ReturnType<typeof setTimeout>;
  public static TIME_TO_GAME_OVER_SCREEN_MS: number = 3000;

  @Action(ToggleCurrentPlayer)
  public toggleCurrentPlayer({getState, patchState}: StateContext<IGameStateModel>): void {
    const {currentPlayer} = getState();
    patchState({
      currentPlayer: currentPlayer === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1,
    });
  }

  @Action(SetGameOver)
  public setGameOver({patchState}: StateContext<IGameStateModel>): void {
    this.gameOverTimeout = setTimeout((): void => {
      patchState({
        gameOver: true,
      });
    }, GameState.TIME_TO_GAME_OVER_SCREEN_MS);
  }

  @Action(IncrementScoreForCurrentPlayer)
  public incrementScoreForCurrentPlayer({getState, patchState}: StateContext<IGameStateModel>): void {
    const {scores, currentPlayer} = getState();
    patchState({
      scores: {
        ...scores,
        [currentPlayer]: scores[currentPlayer] + 1,
      },
    });
  }

  @Action(DeclareWinner)
  public declareWinner({getState, patchState}: StateContext<IGameStateModel>): void {
    const {scores} = getState();
    const {PLAYER1, PLAYER2} = Player;
    const winner: Player | null = scores[PLAYER1] === scores[PLAYER2] ? null : scores[PLAYER1] > scores[PLAYER2] ? PLAYER1 : PLAYER2;
    patchState({
      winner,
    });
  }

  @Action(ResetGameState)
  public resetGameState({patchState}: StateContext<IGameStateModel>): void {
    patchState(defaultState);
    clearTimeout(this.gameOverTimeout);
  }
}
