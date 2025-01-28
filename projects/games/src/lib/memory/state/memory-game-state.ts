import {Action, State, StateContext, StateToken, Store} from "@ngxs/store";
import {IMemoryGameStateModel} from "../api/memory-game-state-model";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {MemoryCard} from "../api/memory-card";
import {
  ContinueAfterMismatch,
  IndicateError,
  IndicateReadyToPlay,
  NewMemoryGame,
  PlayMemoryCardAudio,
  ProcessSelectedMemoryCards,
  RegisterDealtCard,
  ResetIndicateError,
  ResetMemoryGame,
  SelectMemoryCard,
} from "./memory-game-actions";
import {
  DeclareWinner,
  IncrementScoreForCurrentPlayer,
  ResetGameState,
  SetGameOver,
  ToggleCurrentPlayer,
} from "../../state/game-state-actions";
import {GameStateQueries} from "../../state/game-state-queries";
import {PlayMode} from "../api/play-mode";
import {AudioService} from "@media/audio.service";
import {AudioStateQueries} from "@media/state/audio-state-queries";
import {MemoryGameConfig} from "../api/memory-game-config";
import {createDeck, initializeDefaultState, isMemoryCardMatched, isMemoryCardSelected, MEDIA_TIMEOUT} from "./memory-game-util";
import {TimeoutService} from "@utility/timeout.service";

const stateToken: StateToken<IMemoryGameStateModel> = new StateToken<IMemoryGameStateModel>("memoryGameState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: initializeDefaultState(),
})
@Injectable()
export class MemoryGameState {
  constructor(
    private store: Store,
    private audioService: AudioService,
    private timeoutService: TimeoutService,
  ) {}

  @Action(NewMemoryGame)
  public newMemoryGame(
    ctx: StateContext<IMemoryGameStateModel>,
    {memoryCards, numberOfPlayingCards, pairingMode, isSinglePlayer}: NewMemoryGame,
  ): void {
    this.validateNumberOfPlayingCards(numberOfPlayingCards, memoryCards);
    this.resetMemoryGame(ctx);

    const deck: MemoryCard[] = createDeck(memoryCards, numberOfPlayingCards, pairingMode);

    ctx.patchState({
      playingDeck: deck,
      isSinglePlayerMode: isSinglePlayer,
      selectedCards: [],
    });
  }

  private validateNumberOfPlayingCards(numberOfPlayingCards: number, memoryCards: MemoryCard[]): void {
    if (numberOfPlayingCards % 2 !== 0 || numberOfPlayingCards > memoryCards.length * 2) {
      throw new Error("Invalid number of playing cards.");
    }
  }

  @Action(SelectMemoryCard)
  public selectCard(ctx: StateContext<IMemoryGameStateModel>, {selectedMemoryCard}: SelectMemoryCard): void {
    const state: IMemoryGameStateModel = ctx.getState();
    const numberOfCardsToMatch: number = 2;

    if (state.indicateError) {
      this.handleIndicateError(ctx, selectedMemoryCard);
      return;
    }

    if (!this.isValidSelection(selectedMemoryCard, state)) {
      return;
    }

    const updatedSelectedCards: MemoryCard[] = [...state.selectedCards, selectedMemoryCard];
    ctx.patchState({selectedCards: updatedSelectedCards});

    if (updatedSelectedCards.length === numberOfCardsToMatch) {
      this.scheduleCardProcessing(ctx);
    }
  }

  private handleIndicateError(ctx: StateContext<IMemoryGameStateModel>, selectedMemoryCard: MemoryCard): void {
    ctx.dispatch(new ContinueAfterMismatch()).subscribe(() => {
      ctx.dispatch(new SelectMemoryCard(selectedMemoryCard));
    });
  }

  private isValidSelection(card: MemoryCard, state: IMemoryGameStateModel): boolean {
    return (
      card &&
      !isMemoryCardSelected(card, state.selectedCards) &&
      !isMemoryCardMatched(card, state.matchedCards) &&
      state.selectedCards.length < 2
    );
  }

  private scheduleCardProcessing(ctx: StateContext<IMemoryGameStateModel>): void {
    const delay: number = MemoryGameConfig.TIME_UNTIL_CARDS_FLIP_MS + MemoryGameConfig.MEAN_MEDIA_DURATION_MS;

    if (!Number.isFinite(delay)) {
      throw new Error("Invalid delay configuration in MemoryGameConfig.");
    }

    this.timeoutService.setTimeout(
      (): void => {
        this.processSelectedMemoryCards(ctx);
      },
      delay,
      "matchedCardTimeout",
    );
  }

  @Action(ProcessSelectedMemoryCards)
  public processSelectedMemoryCards(ctx: StateContext<IMemoryGameStateModel>): void {
    if (this.isGameOver()) return;

    const selectedCards: MemoryCard[] = ctx.getState().selectedCards;

    if (this.isSelectedCardSamePair(selectedCards)) {
      this.handleSuccessfulMatch(ctx, selectedCards);
    } else {
      this.handleMismatch(ctx);
    }
  }

  private isGameOver(): boolean {
    return this.store.selectSnapshot(GameStateQueries.isGameOver$);
  }

  private handleSuccessfulMatch(ctx: StateContext<IMemoryGameStateModel>, selectedCards: MemoryCard[]): void {
    const state: IMemoryGameStateModel = ctx.getState();
    const matchedCards: MemoryCard[] = [...state.matchedCards, ...selectedCards];

    this.updateMatchedCards(ctx, matchedCards);

    ctx.dispatch(new IncrementScoreForCurrentPlayer());

    if (this.checkGameOver(matchedCards, state.playingDeck)) {
      ctx.dispatch([new SetGameOver(), new DeclareWinner()]);
    }
  }

  private updateMatchedCards(ctx: StateContext<IMemoryGameStateModel>, newMatchedCards: MemoryCard[]): void {
    ctx.patchState({
      matchedCards: newMatchedCards,
      selectedCards: [],
    });
  }

  private handleMismatch(ctx: StateContext<IMemoryGameStateModel>): void {
    ctx.dispatch(new IndicateError());
    this.switchToNextPlayer(ctx);
  }

  @Action(IndicateError)
  public indicateError(ctx: StateContext<IMemoryGameStateModel>): void {
    this.setErrorState(ctx, true);
  }

  @Action(ResetIndicateError)
  public resetIndicateError(ctx: StateContext<IMemoryGameStateModel>): void {
    this.setErrorState(ctx, false);
  }

  private setErrorState(ctx: StateContext<IMemoryGameStateModel>, isError: boolean): void {
    ctx.patchState({indicateError: isError});
  }

  @Action(ContinueAfterMismatch)
  public continueAfterMismatch(ctx: StateContext<IMemoryGameStateModel>): void {
    this.resetIndicateError(ctx);
    this.resetSelectedCards(ctx);
  }

  @Action(ResetMemoryGame)
  public resetMemoryGame(ctx: StateContext<IMemoryGameStateModel>): void {
    ctx.setState(initializeDefaultState());
    ctx.dispatch(new ResetGameState());
    this.timeoutService.clearAllTimeouts();
  }

  private resetSelectedCards(ctx: StateContext<IMemoryGameStateModel>): void {
    ctx.patchState({
      selectedCards: [],
    });
  }

  @Action(PlayMemoryCardAudio)
  public playMemoryCardAudio(ctx: StateContext<IMemoryGameStateModel>, {memoryCard, playMode}: PlayMemoryCardAudio): void {
    const timeoutLengthMs: number = playMode === PlayMode.FLIP_CARDS ? MemoryGameConfig.TIMEOUT_LENGTH_MEDIA_MS : 0;

    this.timeoutService.setTimeout(
      (): void => {
        this.audioService.playSound(memoryCard.audioName, this.store.selectSnapshot(AudioStateQueries.isSoundEnabled$));
      },
      timeoutLengthMs,
      MEDIA_TIMEOUT,
    );
  }

  @Action(IndicateReadyToPlay)
  public indicateReadyToPlay({patchState}: StateContext<IMemoryGameStateModel>): void {
    patchState({
      readyToPlay: true,
    });
  }

  @Action(RegisterDealtCard)
  public registerDealtCard(ctx: StateContext<IMemoryGameStateModel>): void {
    const state: IMemoryGameStateModel = ctx.getState();
    const numberOfRegisteredCardsNow: number = state.numberOfCardsDealt + 1;

    ctx.patchState({numberOfCardsDealt: numberOfRegisteredCardsNow});

    if (this.areAllCardsDealt(numberOfRegisteredCardsNow, state.playingDeck.length)) {
      ctx.dispatch(new IndicateReadyToPlay());
    }
  }

  private areAllCardsDealt(dealtCards: number, totalCards: number): boolean {
    return dealtCards >= totalCards;
  }

  private switchToNextPlayer(ctx: StateContext<IMemoryGameStateModel>): void {
    if (ctx.getState().isSinglePlayerMode) return;
    ctx.dispatch(new ToggleCurrentPlayer());
  }

  private isSelectedCardSamePair(selectedCards: MemoryCard[]): boolean {
    return selectedCards[0].pairId === selectedCards[1].pairId;
  }

  private checkGameOver(matchedCards: MemoryCard[], playingDeck: MemoryCard[]): boolean {
    return matchedCards.length === playingDeck.length;
  }
}
