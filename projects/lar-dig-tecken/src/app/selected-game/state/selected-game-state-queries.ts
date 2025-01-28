import { Selector } from '@ngxs/store'
import { ISelectedGameStateModel } from '../api/selected-game-state-model'
import { SelectedGameState } from './selected-game-state'
import { SelectedGame } from '../api/selected-game'

export class SelectedGameStateQueries {
    @Selector([SelectedGameState])
    public static selectedGame$(state: ISelectedGameStateModel): SelectedGame {
        return state.selectedGame
    }

    @Selector([SelectedGameState])
    public static capitalizedSelectedGame$(state: ISelectedGameStateModel): string {
        return state.selectedGame.charAt(0).toUpperCase() + state.selectedGame.slice(1)
    }

    @Selector([SelectedGameState])
    public static selectedGameDataName$(state: ISelectedGameStateModel): string {
        return state.selectedGame.replace(/\s/g, '-').toLowerCase().toLowerCase().trim()
    }

}