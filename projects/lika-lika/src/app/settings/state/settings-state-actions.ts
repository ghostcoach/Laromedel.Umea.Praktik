import {IPairingMode} from "@games/pairing-mode";
import {TextTransform} from "../api/text-transform";
import {CardCount} from "@games/card-count";
import {PlayerCount} from "../../../../../games/src/lib/api/player-count";
import {PlayMode} from "@games/play-mode";
import {ISettingsStorageData} from "../api/settings-storage-data";
import {CardContent} from "@games/card-content";

export class UpdateTextTransform {
  static readonly type = "[Settings] Update Text Transform";

  constructor(public textTransform: TextTransform) {}
}

export class ToggleTextTransform {
  static readonly type = "[Settings] Toggle Text Transform";
}

export class UpdatePairingMode {
  static readonly type = "[Settings] Update Pairing Mode";

  constructor(public pairingMode: IPairingMode) {}
}

export class UpdatePairingModeFirstCard {
  static readonly type = "[Settings] Update Pairing Mode First Card";

  constructor(public firstCard: CardContent) {}
}

export class UpdatePairingModeSecondCard {
  static readonly type = "[Settings] Update Pairing Mode Second Card";

  constructor(public secondCard: CardContent) {}
}

export class UpdateNumberOfCards {
  static readonly type = "[Settings] Update Number Of Cards";

  constructor(public numberOfCards: CardCount) {}
}

export class UpdateNumberOfPlayers {
  static readonly type = "[Settings] Update Number Of Players";

  constructor(public numberOfPlayers: PlayerCount) {}
}

export class UpdatePlayMode {
  static readonly type = "[Settings] Update Play Mode";

  constructor(public playMode: PlayMode) {}
}

export class TogglePlayMode {
  static readonly type = "[Settings] Toggle Play Mode";
}

export class UpdateIsSettingsLocked {
  static readonly type = "[Settings] Lock Settings";

  constructor(public isSettingsLocked: boolean) {}
}

export class LoadSettingsFromLocalStorage {
  static readonly type = "[LocalStorage] Load settings from local storage";

  constructor(public settingsStorageData: ISettingsStorageData) {}
}
