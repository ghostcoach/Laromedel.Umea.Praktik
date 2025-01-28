import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {ISettingsStateModel} from "../api/settings-state-model";
import {UntilDestroy} from "@ngneat/until-destroy";
import {TextTransform} from "../api/text-transform";
import {CardContent} from "@games/card-content";
import {CardCount} from "@games/card-count";
import {PlayerCount} from "@games/player-count";
import {PlayMode} from "@games/play-mode";
import {Injectable} from "@angular/core";
import {
  LoadSettingsFromLocalStorage,
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
} from "./settings-state-actions";
import {UpdateIsSoundEnabled} from "@media/audio-state-actions";
import {UpdateIsSubtitleEnabled} from "@media/subtitle-actions";

const stateToken: StateToken<ISettingsStateModel> = new StateToken<ISettingsStateModel>("settingsState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    textTransform: TextTransform.LOWERCASE,
    pairingMode: {
      first: CardContent.WORD,
      second: CardContent.ILLUSTRATION,
    },
    numberOfCards: CardCount.FOUR,
    numberOfPlayers: PlayerCount.ONE_PLAYER,
    playMode: PlayMode.FLIP_CARDS,
    isSettingsLocked: false,
  },
})
@Injectable()
export class SettingsState {
  @Action(UpdateTextTransform)
  public updateTextTransform({patchState}: StateContext<ISettingsStateModel>, {textTransform}: UpdateTextTransform): void {
    patchState({textTransform});
  }

  @Action(ToggleTextTransform)
  public toggleTextTransform({getState, patchState}: StateContext<ISettingsStateModel>): void {
    const textTransform: TextTransform =
      getState().textTransform === TextTransform.LOWERCASE ? TextTransform.UPPERCASE : TextTransform.LOWERCASE;

    patchState({textTransform});
  }

  @Action(UpdatePairingMode)
  public updatePairingMode({patchState}: StateContext<ISettingsStateModel>, {pairingMode}: UpdatePairingMode): void {
    patchState({pairingMode});
  }

  @Action(UpdatePairingModeFirstCard)
  public updatePairingModeFirstCard(
    {patchState, getState}: StateContext<ISettingsStateModel>,
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
    {patchState, getState}: StateContext<ISettingsStateModel>,
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
  public updateNumberOfCards({patchState}: StateContext<ISettingsStateModel>, {numberOfCards}: UpdateNumberOfCards): void {
    patchState({numberOfCards});
  }

  @Action(UpdateNumberOfPlayers)
  public updateNumberOfPlayers({patchState}: StateContext<ISettingsStateModel>, {numberOfPlayers}: UpdateNumberOfPlayers): void {
    patchState({numberOfPlayers});
  }

  @Action(UpdatePlayMode)
  public updatePlayMode({patchState}: StateContext<ISettingsStateModel>, {playMode}: UpdatePlayMode): void {
    patchState({playMode});
  }

  @Action(TogglePlayMode)
  public togglePlayMode({getState, patchState}: StateContext<ISettingsStateModel>): void {
    const playMode: PlayMode = getState().playMode === PlayMode.FLIP_CARDS ? PlayMode.OPEN_CARDS : PlayMode.FLIP_CARDS;

    patchState({playMode});
  }

  @Action(UpdateIsSettingsLocked)
  public updateIsSettingsLocked({patchState}: StateContext<ISettingsStateModel>, {isSettingsLocked}: UpdateIsSettingsLocked): void {
    patchState({isSettingsLocked});
  }

  @Action(LoadSettingsFromLocalStorage)
  public loadSettingsFromLocalStorageData(
    {patchState, dispatch}: StateContext<ISettingsStateModel>,
    {settingsStorageData}: LoadSettingsFromLocalStorage,
  ): void {
    patchState({
      textTransform: settingsStorageData.textTransform,
      pairingMode: settingsStorageData.pairingMode,
      numberOfCards: settingsStorageData.numberOfCards,
      numberOfPlayers: settingsStorageData.numberOfPlayers,
      playMode: settingsStorageData.playMode,
    });

    dispatch(new UpdateIsSoundEnabled(settingsStorageData.isSoundEnabled));
    dispatch(new UpdateIsSubtitleEnabled(settingsStorageData.isSubtitlesEnabled));
  }
}
