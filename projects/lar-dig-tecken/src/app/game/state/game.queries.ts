import { Injectable } from "@angular/core";
import { Selector } from '@ngxs/store'
import { GameState } from "./game.state";
import { IGameStateModel } from "./api/game-state-model";

@Injectable()
export class GameStateQueries {
    @Selector([GameState])
    public static gameState$(state: IGameStateModel) : boolean {
        return state?.gameStarted ?? true;
    }

    @Selector([GameState])
    public static gameOver$(state: IGameStateModel) : boolean {
        return state?.gameOver ?? false;
    }

    @Selector([GameState])
    public static currentRound$(state: IGameStateModel) : number {
        return state?.currentRound ?? 0;
    }

    @Selector([GameState])
    public static numberOfGamesPlayed$(state: IGameStateModel) : number {
        return state?.numberOfGamesPlayed ?? 0;
    }  

}