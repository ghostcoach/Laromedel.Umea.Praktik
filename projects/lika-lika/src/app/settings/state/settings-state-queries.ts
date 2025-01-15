import {Injectable} from "@angular/core";
import {Selector} from "@ngxs/store";
import {ISettingsStateModel} from "../api/settings-state-model";
import {SettingsState} from "./settings-state";
import {TextTransform} from "../api/text-transform";
import {IPairingMode} from "@games/pairing-mode";
import {CardCount} from "@games/card-count";
import {PlayerCount} from "../../../../../games/src/lib/api/player-count";
import {PlayMode} from "@games/play-mode";
import {ISettingsStorageData} from "../api/settings-storage-data";
import {AudioStateQueries} from "@media/audio-state-queries";
import {SubtitleQueries} from "@media/subtitle-queries";

@Injectable()
export class SettingsStateQueries {
  @Selector([SettingsState])
  public static textTransform$(state: ISettingsStateModel): TextTransform {
    return state.textTransform;
  }

  @Selector([SettingsState])
  public static isUpperCaseTextTransform$(state: ISettingsStateModel): boolean {
    return state.textTransform === TextTransform.UPPERCASE;
  }

  @Selector([SettingsState])
  public static pairingMode$(state: ISettingsStateModel): IPairingMode {
    return state.pairingMode;
  }

  @Selector([SettingsState])
  public static pairingModeFirstCard$(state: ISettingsStateModel): string {
    return state.pairingMode?.first;
  }

  @Selector([SettingsState])
  public static pairingModeSecondCard$(state: ISettingsStateModel): string {
    return state.pairingMode?.second;
  }

  @Selector([SettingsState])
  public static numberOfCards$(state: ISettingsStateModel): CardCount {
    return state.numberOfCards;
  }

  @Selector([SettingsState])
  public static numberOfPlayers$(state: ISettingsStateModel): PlayerCount {
    return state.numberOfPlayers;
  }

  @Selector([SettingsState])
  public static isOnePlayer$(state: ISettingsStateModel): boolean {
    return state.numberOfPlayers === PlayerCount.ONE_PLAYER;
  }

  @Selector([SettingsState])
  public static isTwoPlayers$(state: ISettingsStateModel): boolean {
    return state.numberOfPlayers === PlayerCount.TWO_PLAYERS;
  }

  @Selector([SettingsState])
  public static playMode$(state: ISettingsStateModel): PlayMode {
    return state.playMode;
  }

  @Selector([SettingsState])
  public static isOpenCardsPlayMode$(state: ISettingsStateModel): boolean {
    return state.playMode === PlayMode.OPEN_CARDS;
  }

  @Selector([SettingsState])
  public static isSettingsLocked$(state: ISettingsStateModel): boolean {
    return state.isSettingsLocked;
  }

  @Selector([
    AudioStateQueries.isSoundEnabled$,
    SubtitleQueries.isSubtitleEnabled$,
    SettingsStateQueries.textTransform$,
    SettingsStateQueries.pairingMode$,
    SettingsStateQueries.numberOfCards$,
    SettingsStateQueries.numberOfPlayers$,
    SettingsStateQueries.playMode$,
  ])
  public static settingsStorageData$(
    isSoundEnabled: boolean,
    isSubtitlesEnabled: boolean,
    textTransform: TextTransform,
    pairingMode: IPairingMode,
    numberOfCards: CardCount,
    numberOfPlayers: PlayerCount,
    playMode: PlayMode,
  ): ISettingsStorageData {
    return {
      isSoundEnabled,
      isSubtitlesEnabled,
      textTransform,
      pairingMode,
      numberOfCards,
      numberOfPlayers,
      playMode,
    };
  }
}
