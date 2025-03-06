import { IGameStateModel } from "./api/game-state-model";

export class UpdateGameState {
    static readonly type = '[Game State] Update Game State';

    constructor(public payload: IGameStateModel["gameStarted"]) {}    
}

export class UpdateGameOver {
    static readonly type = '[Game State] Update Game Over';

    constructor(public payload: IGameStateModel["gameOver"]) {}    
}

export class UpdateCurrentRound {
    static readonly type = '[Game State] Update Current Round';

    constructor(public payload?: IGameStateModel["currentRound"]) {}    
}

export class UpdateNumberOfGamesPlayed {
    static readonly type = '[Game State] Update Number Of Games Played';

    constructor(public payload?: IGameStateModel["numberOfGamesPlayed"]) {}    
}

export class ResetCurrentRound {
    static readonly type = '[Game State] Reset Current Round';
}
