import {MemoryCard} from "../api/memory-card";
import {IPairingMode} from "../api/pairing-mode";

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

export class ResetMemoryGame {
  static readonly type: string = "[MemoryGame] Reset Game";
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

export class IndicateReadyToPlay {
  static readonly type: string = "[MemoryGame] Indicate Ready To Play";
}

export class RegisterDealtCard {
  static readonly type: string = "[MemoryGame] Register Dealt Card";
}
