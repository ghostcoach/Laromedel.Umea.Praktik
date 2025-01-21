import {fakeAsync, TestBed, tick} from "@angular/core/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {Player} from "../api/player";
import {GameState} from "./game-state";
import {DeclareWinner, IncrementScoreForCurrentPlayer, ResetGameState, SetGameOver, ToggleCurrentPlayer} from "./game-state-actions";
import {IGameStateModel} from "../api/game-state-model";

describe("GameState", (): void => {
  let store: Store;

  const initialState: IGameStateModel = {
    currentPlayer: Player.PLAYER1,
    gameOver: false,
    winner: null,
    scores: {
      [Player.PLAYER1]: 0,
      [Player.PLAYER2]: 0,
    },
  };

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([GameState])],
    });

    store = TestBed.inject(Store);
    store.reset({gameState: initialState});
  });

  it("should toggle the current player when ToggleCurrentPlayer is dispatched", (): void => {
    store.dispatch(new ToggleCurrentPlayer());

    const state: IGameStateModel = store.selectSnapshot((state) => state.gameState);
    expect(state.currentPlayer).toBe(Player.PLAYER2);
  });

  it("should set game over when SetGameOver is dispatched", fakeAsync((): void => {
    store.dispatch(new SetGameOver());

    tick(GameState.TIME_TO_GAME_OVER_SCREEN_MS + 250);

    const state: IGameStateModel = store.selectSnapshot((state) => state.gameState);
    expect(state.gameOver).toBe(true);
  }));

  it("should increment score for the current player when IncrementScoreForCurrentPlayer is dispatched", (): void => {
    store.dispatch(new IncrementScoreForCurrentPlayer());

    const state: IGameStateModel = store.selectSnapshot((state) => state.gameState);
    expect(state.scores[Player.PLAYER1]).toBe(1);
    expect(state.scores[Player.PLAYER2]).toBe(0);
  });

  it("should declare the correct winner when DeclareWinner is dispatched", (): void => {
    // Case 1: Player 1 has more points
    store.reset({
      gameState: {
        ...initialState,
        scores: {
          [Player.PLAYER1]: 2,
          [Player.PLAYER2]: 1,
        },
      },
    });

    store.dispatch(new DeclareWinner());

    const state: IGameStateModel = store.selectSnapshot((state) => state.gameState);
    expect(state.winner).toBe(Player.PLAYER1);

    // Case 2: Player 2 has more points
    store.reset({
      gameState: {
        ...initialState,
        scores: {
          [Player.PLAYER1]: 1,
          [Player.PLAYER2]: 3,
        },
      },
    });

    store.dispatch(new DeclareWinner());

    const updatedState: IGameStateModel = store.selectSnapshot((state) => state.gameState);
    expect(updatedState.winner).toBe(Player.PLAYER2);

    // Case 3: Tie
    store.reset({
      gameState: {
        ...initialState,
        scores: {
          [Player.PLAYER1]: 2,
          [Player.PLAYER2]: 2,
        },
      },
    });

    store.dispatch(new DeclareWinner());

    const tieState: IGameStateModel = store.selectSnapshot((state) => state.gameState);
    expect(tieState.winner).toBeNull();
  });

  it("should reset the game state when ResetGameState is dispatched", (): void => {
    store.dispatch(new ResetGameState());

    const state: IGameStateModel = store.selectSnapshot((state) => state.gameState);
    expect(state).toEqual(initialState);
  });
});
