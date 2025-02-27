import { Action, State, StateContext, StateToken, Selector } from '@ngxs/store'
import { Injectable } from '@angular/core'
import { IGameStateModel } from './api/game-state-model'
import { UpdateGameState } from './game.actions'


const stateToken: StateToken<IGameStateModel> = new StateToken<IGameStateModel>("gameState")

@State({
    name: stateToken,
    defaults: {
        gameStarted: false
    }
})

@Injectable()
export class GameState {
    @Action(UpdateGameState)
    updateGameState(
        ctx: StateContext<IGameStateModel>, 
        action: UpdateGameState):void {        
            ctx.patchState({
                gameStarted: action.payload
            });
      }

    @Selector()
    static getGameState(state: IGameStateModel): boolean {
        return state.gameStarted;
    }
}