import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {UntilDestroy} from "@ngneat/until-destroy";
import {TextTransform} from "@media/text-transform";
import {inject, Injectable} from "@angular/core";
import {
  TogglePlayMode,
  ToggleTextTransform,
  UpdateIsSettingsLocked,
  UpdateNumberOfCards,
  UpdateNumberOfPlayers,
  UpdatePairingMode,
  UpdatePairingModeFirstCard,
  UpdatePairingModeSecondCard,
  UpdatePlayMode,
  UpdateTextTransform,
} from "./memory-settings-state-actions";
import {IMemorySettingsStateModel} from "../api/memory-settings-state-model";
import {PlayMode} from "../api/play-mode";
import {CardContent} from "../api/card-content";
import {PlayerCount} from "../../api/player-count";
import {CardCount} from "../api/card-count";
import {LocalStorageService} from "ngx-localstorage";

const stateToken: StateToken<IMemorySettingsStateModel> = new StateToken<IMemorySettingsStateModel>("memorySettingsState");
const defaultState: IMemorySettingsStateModel = {
  textTransform: TextTransform.LOWERCASE,
  pairingMode: {
    first: CardContent.WORD,
    second: CardContent.ILLUSTRATION,
  },
  numberOfCards: CardCount.SIX,
  numberOfPlayers: PlayerCount.ONE_PLAYER,
  playMode: PlayMode.OPEN_CARDS,
  isSettingsLocked: false,
};

@UntilDestroy()
@State({
  name: stateToken,
  defaults: defaultState,
})
@Injectable()
export class MemorySettingsState {
  private localStorageService: LocalStorageService = inject(LocalStorageService);

  constructor() {
    this.hydrateState();
  }

  private readonly localStorageKey: string = "memorySettingsState";

  private hydrateState(): void {
    const storedState: IMemorySettingsStateModel | null = this.localStorageService.get<IMemorySettingsStateModel>(this.localStorageKey);
    if (!storedState) return;

    Object.assign(defaultState, storedState);
  }

  @Action(UpdatePairingModeFirstCard)
  @Action(UpdatePairingModeSecondCard)
  @Action(UpdateNumberOfCards)
  @Action(UpdatePlayMode)
  @Action(UpdateNumberOfPlayers)
  @Action(TogglePlayMode)
  @Action(ToggleTextTransform)
  public saveToLocalStorage({getState}: StateContext<IMemorySettingsStateModel>): void {
    setTimeout((): void => {
      this.localStorageService.set<IMemorySettingsStateModel>(this.localStorageKey, getState());
    }, 500);
  }

  @Action(UpdatePairingMode)
  public updatePairingMode({patchState}: StateContext<IMemorySettingsStateModel>, {pairingMode}: UpdatePairingMode): void {
    patchState({pairingMode});
  }

  @Action(UpdatePairingModeFirstCard)
  public updatePairingModeFirstCard(
    {patchState, getState}: StateContext<IMemorySettingsStateModel>,
    {firstCard}: UpdatePairingModeFirstCard,
  ): void {
    patchState({
      pairingMode: {
        first: firstCard,
        second: getState().pairingMode.second,
      },
    });
  }

  @Action(UpdatePairingModeSecondCard)
  public updatePairingModeSecondCard(
    {patchState, getState}: StateContext<IMemorySettingsStateModel>,
    {secondCard}: UpdatePairingModeSecondCard,
  ): void {
    patchState({
      pairingMode: {
        first: getState().pairingMode.first,
        second: secondCard,
      },
    });
  }

  @Action(UpdateNumberOfCards)
  public updateNumberOfCards({patchState}: StateContext<IMemorySettingsStateModel>, {numberOfCards}: UpdateNumberOfCards): void {
    patchState({numberOfCards});
  }

  @Action(UpdateNumberOfPlayers)
  public updateNumberOfPlayers({patchState}: StateContext<IMemorySettingsStateModel>, {numberOfPlayers}: UpdateNumberOfPlayers): void {
    patchState({numberOfPlayers});
  }

  @Action(UpdatePlayMode)
  public updatePlayMode({patchState}: StateContext<IMemorySettingsStateModel>, {playMode}: UpdatePlayMode): void {
    patchState({playMode});
  }

  @Action(TogglePlayMode)
  public togglePlayMode({getState, patchState}: StateContext<IMemorySettingsStateModel>): void {
    const playMode: PlayMode = getState().playMode === PlayMode.FLIP_CARDS ? PlayMode.OPEN_CARDS : PlayMode.FLIP_CARDS;

    patchState({playMode});
  }

  @Action(UpdateIsSettingsLocked)
  public updateIsSettingsLocked({patchState}: StateContext<IMemorySettingsStateModel>, {isSettingsLocked}: UpdateIsSettingsLocked): void {
    patchState({isSettingsLocked});
  }

  @Action(UpdateTextTransform)
  public updateTextTransform({patchState}: StateContext<IMemorySettingsStateModel>, {textTransform}: UpdateTextTransform): void {
    patchState({textTransform});
  }

  @Action(ToggleTextTransform)
  public toggleTextTransform({getState, patchState}: StateContext<IMemorySettingsStateModel>): void {
    const textTransform: TextTransform =
      getState().textTransform === TextTransform.LOWERCASE ? TextTransform.UPPERCASE : TextTransform.LOWERCASE;

    patchState({textTransform});
  }
}
