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

}