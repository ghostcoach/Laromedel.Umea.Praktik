import {TextTransform} from "@media/text-transform";
import {PlayerCount} from "../../api/player-count";
import {IPairingMode} from "./pairing-mode";
import {CardCount} from "./card-count";
import {PlayMode} from "./play-mode";

export interface IMemorySettingsStateModel {
  textTransform: TextTransform;
  pairingMode: IPairingMode;
  numberOfCards: CardCount;
  numberOfPlayers: PlayerCount;
  playMode: PlayMode;
  isSettingsLocked: boolean;
}
