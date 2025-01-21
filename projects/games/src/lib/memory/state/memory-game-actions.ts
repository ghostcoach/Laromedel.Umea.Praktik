import {MemoryCard} from "../api/memory-card";
import {IPairingMode} from "../api/pairing-mode";
import {PlayMode} from "../api/play-mode";

export class NewMemoryGame {
  static readonly type: string = "[MemoryGame] New Game";

  constructor(
    public memoryCards: MemoryCard[],
    public numberOfPlayingCards: number,
    public pairingMode: IPairingMode,
    public isSinglePlayer: boolean,
  ) {}
}

export class SelectMemoryCard {
  static readonly type: string = "[MemoryGame] Select Card";

  constructor(public selectedMemoryCard: MemoryCard) {}
}

export class ProcessSelectedMemoryCards {
  static readonly type: string = "[MemoryGame] Process Selected Cards";
}

export class ResetMemoryGame {
  static readonly type: string = "[MemoryGame] Reset Game";
}

export class PlayMemoryCardAudio {
  static readonly type: string = "[MemoryGame] Play Card Audio";

  constructor(
    public memoryCard: MemoryCard,
    public playMode: PlayMode,
  ) {}
}

export class RestartMemoryGame {
  static readonly type: string = "[MemoryGame] Restart Game";
}

export class IndicateError {
  static readonly type: string = "[MemoryGame] Indicate Error";
}

export class ResetIndicateError {
  static readonly type: string = "[MemoryGame] Reset Indicate Error";
}

export class ContinueAfterMismatch {
  static readonly type: string = "[MemoryGame] Continue After Match";
}
