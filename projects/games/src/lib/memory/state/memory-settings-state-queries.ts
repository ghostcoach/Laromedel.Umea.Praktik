import {Injectable} from "@angular/core";
import {Selector} from "@ngxs/store";
import {MemorySettingsState} from "./memory-settings-state";
import {TextTransform} from "@media/text-transform";
import {PlayerCount} from "../../api/player-count";
import {IMemorySettingsStateModel} from "../api/memory-settings-state-model";
import {IPairingMode} from "../api/pairing-mode";
import {CardCount} from "../api/card-count";
import {PlayMode} from "../api/play-mode";

@Injectable()
export class MemorySettingsStateQueries {
  @Selector([MemorySettingsState])
  public static textTransform$(state: IMemorySettingsStateModel): TextTransform {
    return state.textTransform;
  }

  @Selector([MemorySettingsState])
  public static isUpperCaseTextTransform$(state: IMemorySettingsStateModel): boolean {
    return state.textTransform === TextTransform.UPPERCASE;
  }

  @Selector([MemorySettingsState])
  public static pairingMode$(state: IMemorySettingsStateModel): IPairingMode {
    return state.pairingMode;
  }

  @Selector([MemorySettingsState])
  public static pairingModeFirstCard$(state: IMemorySettingsStateModel): string {
    return state.pairingMode?.first;
  }

  @Selector([MemorySettingsState])
  public static pairingModeSecondCard$(state: IMemorySettingsStateModel): string {
    return state.pairingMode?.second;
  }

  @Selector([MemorySettingsState])
  public static numberOfCards$(state: IMemorySettingsStateModel): CardCount {
    return state.numberOfCards;
  }

  @Selector([MemorySettingsState])
  public static numberOfPlayers$(state: IMemorySettingsStateModel): PlayerCount {
    return state.numberOfPlayers;
  }

  @Selector([MemorySettingsState])
  public static isOnePlayer$(state: IMemorySettingsStateModel): boolean {
    return state.numberOfPlayers === PlayerCount.ONE_PLAYER;
  }

  @Selector([MemorySettingsState])
  public static isTwoPlayers$(state: IMemorySettingsStateModel): boolean {
    return state.numberOfPlayers === PlayerCount.TWO_PLAYERS;
  }

  @Selector([MemorySettingsState])
  public static playMode$(state: IMemorySettingsStateModel): PlayMode {
    return state.playMode;
  }

  @Selector([MemorySettingsState])
  public static isOpenCardsPlayMode$(state: IMemorySettingsStateModel): boolean {
    return state.playMode === PlayMode.OPEN_CARDS;
  }

  @Selector([MemorySettingsState])
  public static isSettingsLocked$(state: IMemorySettingsStateModel): boolean {
    return state.isSettingsLocked;
  }
}
