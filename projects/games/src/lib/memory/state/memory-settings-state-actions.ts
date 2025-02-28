import {IPairingMode} from "../api/pairing-mode";
import {CardContent} from "../api/card-content";
import {CardCount} from "../api/card-count";
import {PlayerCount} from "../../api/player-count";
import {PlayMode} from "../api/play-mode";
import {TextTransform} from "@media/text-transform";

export class UpdatePairingMode {
  static readonly type: string = "[MemorySettings] Update Pairing Mode";

  constructor(public pairingMode: IPairingMode) {}
}

export class UpdatePairingModeFirstCard {
  static readonly type: string = "[MemorySettings] Update Pairing Mode First Card";

  constructor(public firstCard: CardContent) {}
}

export class UpdatePairingModeSecondCard {
  static readonly type: string = "[MemorySettings] Update Pairing Mode Second Card";

  constructor(public secondCard: CardContent) {}
}

export class UpdateNumberOfCards {
  static readonly type: string = "[MemorySettings] Update Number Of Cards";

  constructor(public numberOfCards: CardCount) {}
}

export class UpdateNumberOfPlayers {
  static readonly type: string = "[MemorySettings] Update Number Of Players";

  constructor(public numberOfPlayers: PlayerCount) {}
}

export class UpdatePlayMode {
  static readonly type: string = "[MemorySettings] Update Play Mode";

  constructor(public playMode: PlayMode) {}
}

export class TogglePlayMode {
  static readonly type: string = "[MemorySettings] Toggle Play Mode";
}

export class UpdateIsSettingsLocked {
  static readonly type: string = "[MemorySettings] Lock Settings";

  constructor(public isSettingsLocked: boolean) {}
}

export class UpdateTextTransform {
  static readonly type: string = "[MemoryGame] Update Text Transform";

  constructor(public textTransform: TextTransform) {}
}

export class ToggleTextTransform {
  static readonly type: string = "[MemoryGame] Toggle Text Transform";
}
