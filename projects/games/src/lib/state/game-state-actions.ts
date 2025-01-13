export class ToggleCurrentPlayer {
  static readonly type: string = "[GameState] Toggle Current Player";
}

export class DeclareWinner {
  static readonly type: string = "[GameState] Declare Winner";
}

export class ResetGameState {
  static readonly type: string = "[GameState] Reset Game State";
}

export class SetGameOver {
  static readonly type: string = "[GameState] Set Game Over";
}

export class IncrementScoreForCurrentPlayer {
  static readonly type: string = "[GameState] Increment Score For Current Player";
}
