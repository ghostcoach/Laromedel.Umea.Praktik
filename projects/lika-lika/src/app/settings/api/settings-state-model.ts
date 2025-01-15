import {TextTransform} from "./text-transform";
import {IPairingMode} from "@games/pairing-mode";
import {CardCount} from "@games/card-count";
import {PlayerCount} from "../../../../../games/src/lib/api/player-count";
import {PlayMode} from "@games/play-mode";

export interface ISettingsStateModel {
  textTransform: TextTransform;
  pairingMode: IPairingMode;
  numberOfCards: CardCount;
  numberOfPlayers: PlayerCount;
  playMode: PlayMode;
  isSettingsLocked: boolean;
}
