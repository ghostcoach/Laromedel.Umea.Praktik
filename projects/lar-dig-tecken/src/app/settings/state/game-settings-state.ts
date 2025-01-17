import {Action, State, StateContext, StateToken} from '@ngxs/store'
import {Injectable} from '@angular/core'
import { IGameSettingStateModel } from './api/game-settings-state-model'
import { UpdateFirstPairingMode, UpdateSecondPairingMode, UpdateCategory, UseAllCategories } from './game-settings-actions'
import { CardContent } from '../../../../../games/src/lib/api/card-content'
import { Category } from '../../category/api/category'

const stateToken: StateToken<IGameSettingStateModel> = new StateToken<IGameSettingStateModel>("gameSettingsState")

@State({
    name: stateToken,
    defaults: {
        numberOfOptions: 3,
        pairingMode: { 
            first: CardContent.ILLUSTRATION,
            second: CardContent.RITADE_TECKEN,
        },
        category: Category.ALLA,
        numberOfRounds: 5,
    },
})

@Injectable()
export class GameSettingsState {
    @Action(UpdateFirstPairingMode)
    updateFirstPairingMode(ctx: StateContext<IGameSettingStateModel>, action: UpdateFirstPairingMode):void {
        const state = ctx.getState();
        ctx.patchState({
          pairingMode: {
            ...state.pairingMode,
            first: action.payload
          }
        });
      }

    @Action(UpdateSecondPairingMode)
    updateSecondPairingMode(ctx: StateContext<IGameSettingStateModel>, action: UpdateSecondPairingMode) {
        const state = ctx.getState();
        ctx.patchState({
          pairingMode: {
            ...state.pairingMode,
            second: action.payload
          }
        });
      }

    @Action(UpdateCategory)
    public updateCategory(
        {patchState}: StateContext<IGameSettingStateModel>,
        {category}: UpdateCategory
    ) : void {

        //Lägg till funktionell kod här
        patchState({category: category})
    }

    @Action(UseAllCategories)
    public useAllCategories(
        {patchState}: StateContext<IGameSettingStateModel>,
        {useAllCategories}: UseAllCategories
    ) : void {

        //Lägg till funktionell kod här
        patchState({category: useAllCategories})
    }
}