import {Action, State, StateContext, StateToken, Store} from "@ngxs/store";
import {IMemoryGameStateModel} from "../api/memory-game-state-model";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {MemoryCard} from "../api/memory-card";
import {
  ContinueAfterMismatch,
  IndicateError,
  NewMemoryGame,
  PlayMemoryCardAudio,
  ProcessSelectedMemoryCards,
  ResetIndicateError,
  ResetMemoryGame,
  SelectMemoryCard,
} from "./memory-game-actions";
import {shuffle} from "@utility/shuffle";
import {
  DeclareWinner,
  IncrementScoreForCurrentPlayer,
  ResetGameState,
  SetGameOver,
  ToggleCurrentPlayer,
} from "../../state/game-state-actions";
import {GameStateQueries} from "../../state/game-state-queries";
import {IPairingMode} from "../api/pairing-mode";
import {CardContent} from "../api/card-content";
import {PlayMode} from "../api/play-mode";
import {AudioService} from "@media/audio.service";
import {AudioStateQueries} from "@media/state/audio-state-queries";

const stateToken: StateToken<IMemoryGameStateModel> = new StateToken<IMemoryGameStateModel>("memoryGameState");
const defaultState: IMemoryGameStateModel = {
  playingDeck: [],
  isSinglePlayerMode: true,
  selectedCards: [],
  matchedCards: [],
  indicateError: false,
};

@UntilDestroy()
@State({
  name: stateToken,
  defaults: defaultState,
})
@Injectable()
export class MemoryGameState {
  public static readonly TIME_UNTIL_CARDS_FLIP_MS: number = 600;
  public static readonly TIME_AFTER_FLIP_OVER_TO_PLAY_AUDIO_MS: number = 300;
  public static readonly MEAN_MEDIA_DURATION_MS: number = 2500;
  public static readonly TIMEOUT_LENGTH_MEDIA_MS: number =
    MemoryGameState.TIME_UNTIL_CARDS_FLIP_MS + MemoryGameState.TIME_AFTER_FLIP_OVER_TO_PLAY_AUDIO_MS;

  public static readonly TIME_TO_SHOW_MATCH_BEFORE_DISAPPEAR_MS: number = 1500;

  public memoryCardMediaTimeout: ReturnType<typeof setTimeout>;
  private matchedCardTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private store: Store,
    private audioService: AudioService,
  ) {}

  @Action(NewMemoryGame)
  public newMemoryGame(
    ctx: StateContext<IMemoryGameStateModel>,
    {memoryCards, numberOfPlayingCards, pairingMode, isSinglePlayer}: NewMemoryGame,
  ): void {
    if (numberOfPlayingCards % 2 !== 0 || numberOfPlayingCards > memoryCards.length * 2) {
      throw new Error("Invalid number of playing cards.");
    }

    this.resetMemoryGame(ctx);
    const deck: MemoryCard[] = this.createDeck(memoryCards, numberOfPlayingCards, pairingMode);

    ctx.patchState({
      playingDeck: deck,
      isSinglePlayerMode: isSinglePlayer,
      selectedCards: [],
    });
  }

  private isMemoryCardSelected(memoryCard: MemoryCard, selectedCards: MemoryCard[]): boolean {
    return selectedCards.some((selectedCard: MemoryCard): boolean => selectedCard.id === memoryCard.id);
  }

  private isMemoryCardMatched(memoryCard: MemoryCard, matchedCards: MemoryCard[]): boolean {
    return matchedCards.some((matchedCard: MemoryCard): boolean => matchedCard.id === memoryCard.id);
  }

  @Action(SelectMemoryCard)
  public selectCard(ctx: StateContext<IMemoryGameStateModel>, {selectedMemoryCard}: SelectMemoryCard): void {
    const state: IMemoryGameStateModel = ctx.getState();
    const numberOfCardsToMatch: number = 2;
    const alreadySelectedTwoCards: boolean = state.selectedCards.length >= numberOfCardsToMatch;

    if (state.indicateError) {
      // If there is a mismatch, the next action should reset the error indication and then directly select the new card.
      ctx.dispatch(new ContinueAfterMismatch()).subscribe((): void => {
        ctx.dispatch(new SelectMemoryCard(selectedMemoryCard));
      });

      return;
    }

    if (
      !selectedMemoryCard ||
      this.isMemoryCardSelected(selectedMemoryCard, state.selectedCards) ||
      this.isMemoryCardMatched(selectedMemoryCard, state.matchedCards) ||
      alreadySelectedTwoCards
    )
      return;

    const isReadyForMatch: boolean = state.selectedCards.length + 1 === numberOfCardsToMatch;
    const selectedCards: MemoryCard[] = [...state.selectedCards, selectedMemoryCard];

    ctx.patchState({selectedCards});

    if (!isReadyForMatch) return;

    this.matchedCardTimeout = setTimeout((): void => {
      this.processSelectedMemoryCards(ctx);
    }, MemoryGameState.TIME_UNTIL_CARDS_FLIP_MS + MemoryGameState.MEAN_MEDIA_DURATION_MS);
  }

  @Action(ProcessSelectedMemoryCards)
  public processSelectedMemoryCards(ctx: StateContext<IMemoryGameStateModel>): void {
    if (this.store.selectSnapshot(GameStateQueries.isGameOver$)) return;

    const state: IMemoryGameStateModel = ctx.getState();

    if (this.isSelectedCardSamePair(state.selectedCards)) {
      this.handleMatchedCards(ctx, state.selectedCards);
      return;
    }

    ctx.dispatch(new IndicateError());
    this.switchPlayer(ctx);
  }

  @Action(IndicateError)
  public indicateError({patchState}: StateContext<IMemoryGameStateModel>): void {
    patchState({
      indicateError: true,
    });
  }

  @Action(ResetIndicateError)
  public resetIndicateError({patchState}: StateContext<IMemoryGameStateModel>): void {
    patchState({
      indicateError: false,
    });
  }

  @Action(ContinueAfterMismatch)
  public continueAfterMismatch(ctx: StateContext<IMemoryGameStateModel>): void {
    this.resetIndicateError(ctx);
    this.resetSelectedCards(ctx);
  }

  @Action(ResetMemoryGame)
  public resetMemoryGame(ctx: StateContext<IMemoryGameStateModel>): void {
    ctx.setState(defaultState);
    ctx.dispatch(new ResetGameState());
    clearTimeout(this.memoryCardMediaTimeout);
    clearTimeout(this.matchedCardTimeout);
  }

  private resetSelectedCards(ctx: StateContext<IMemoryGameStateModel>): void {
    ctx.patchState({
      selectedCards: [],
    });
  }

  @Action(PlayMemoryCardAudio)
  public playMemoryCardAudio(ctx: StateContext<IMemoryGameStateModel>, {memoryCard, playMode}: PlayMemoryCardAudio): void {
    const timeoutLengthMs: number = playMode === PlayMode.FLIP_CARDS ? MemoryGameState.TIMEOUT_LENGTH_MEDIA_MS : 0;

    this.memoryCardMediaTimeout = setTimeout((): void => {
      this.audioService.playSound(memoryCard.audioName, this.store.selectSnapshot(AudioStateQueries.isSoundEnabled$));
    }, timeoutLengthMs);
  }

  private handleMatchedCards(ctx: StateContext<IMemoryGameStateModel>, selectedCards: MemoryCard[]): void {
    const state: IMemoryGameStateModel = ctx.getState();
    const matchedCards: MemoryCard[] = [...state.matchedCards, ...selectedCards];

    ctx.patchState({
      selectedCards: [],
      matchedCards: matchedCards,
    });

    ctx.dispatch(new IncrementScoreForCurrentPlayer());

    if (this.checkGameOver(matchedCards, state.playingDeck)) {
      ctx.dispatch(new SetGameOver());
      ctx.dispatch(new DeclareWinner());
    }
  }

  private switchPlayer(ctx: StateContext<IMemoryGameStateModel>): void {
    const state: IMemoryGameStateModel = ctx.getState();
    if (state.isSinglePlayerMode) return;

    ctx.dispatch(new ToggleCurrentPlayer());
  }

  private isSelectedCardSamePair(selectedCards: MemoryCard[]): boolean {
    return selectedCards[0].pairId === selectedCards[1].pairId;
  }

  private checkGameOver(matchedCards: MemoryCard[], playingDeck: MemoryCard[]): boolean {
    return matchedCards.length === playingDeck.length;
  }

  private createDeck(memoryCards: MemoryCard[], numberOfPlayingCards: number, pairingMode: IPairingMode): MemoryCard[] {
    const initialShuffledDeck: MemoryCard[] = shuffle<MemoryCard>(memoryCards);
    const uniqueCards: number = numberOfPlayingCards / 2;
    const cardsToPlayWith: MemoryCard[] = initialShuffledDeck
      .slice(0, uniqueCards)
      .map((card: MemoryCard): MemoryCard => card.copy(pairingMode.first));

    const pairedCards: MemoryCard[] = cardsToPlayWith.map(
      (card: MemoryCard): MemoryCard => this.createMemoryCardPair(card, pairingMode.second),
    );
    return shuffle([...cardsToPlayWith, ...pairedCards]);
  }

  private createMemoryCardPair(memoryCard: MemoryCard, secondCardContent: CardContent): MemoryCard {
    return new MemoryCard(memoryCard.pairId, memoryCard.word, memoryCard.baseHref, secondCardContent);
  }
}
