import { IGameStateModel } from "./api/game-state-model";

export class UpdateGameState {
    static readonly type = '[Game State] Update Game State';

    constructor(public payload: IGameStateModel["gameStarted"]) {}    
}