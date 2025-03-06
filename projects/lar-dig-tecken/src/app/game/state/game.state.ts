import { Action, State, StateContext, StateToken, Selector } from '@ngxs/store'
import { Injectable } from '@angular/core'
import { IGameStateModel } from './api/game-state-model'
import { UpdateGameState, UpdateCurrentRound, ResetCurrentRound, UpdateGameOver, UpdateNumberOfGamesPlayed } from './game.actions'

const stateToken: StateToken<IGameStateModel> = new StateToken<IGameStateModel>("gameState")

@State({
    name: stateToken,
    defaults: {
        gameStarted: false,
        gameOver: false,
        currentRound: -1,
        numberOfGamesPlayed: 0
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

    @Action(UpdateGameOver)
    updateGameOver(
        ctx: StateContext<IGameStateModel>,
        action: UpdateGameOver):void {
            ctx.patchState({
                gameOver: action.payload
            });
        }
    
    @Selector()
    static getGameOver(state: IGameStateModel): boolean {
        return state.gameOver;
    }

    @Action(UpdateCurrentRound)
    updateCurrentRound(ctx: StateContext<IGameStateModel>): void {
        const state = ctx.getState();
        ctx.patchState({
            currentRound: state.currentRound + 1
        });
    }

    @Action(ResetCurrentRound) // New Action
    resetCurrentRound(ctx: StateContext<IGameStateModel>): void {
        ctx.patchState({
            currentRound: -1
        });
    }
    
    @Selector()
    static getCurrentRound(state: IGameStateModel): number {
        return state.currentRound;
    }

    @Action(UpdateNumberOfGamesPlayed)
    updateNumberOfGamesPlayes(ctx: StateContext<IGameStateModel>): void {
        const state = ctx.getState();
        ctx.patchState({
            numberOfGamesPlayed: state.numberOfGamesPlayed + 1
        });
    }

    @Selector()
    static getNumberOfGamesPlayed(state: IGameStateModel): number {
        return state.numberOfGamesPlayed;
    }

}