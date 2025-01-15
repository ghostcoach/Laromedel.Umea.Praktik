import {IPairingMode} from "@games/pairing-mode";
import {TextTransform} from "./text-transform";
import {CardCount} from "@games/card-count";
import {PlayerCount} from "../../../../../games/src/lib/api/player-count";
import {PlayMode} from "@games/play-mode";

export interface ISettingsStorageData {
  isSoundEnabled: boolean;
  isSubtitlesEnabled: boolean;
  textTransform: TextTransform;
  pairingMode: IPairingMode;
  numberOfCards: CardCount;
  numberOfPlayers: PlayerCount;
  playMode: PlayMode;
}
