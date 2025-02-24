import { Action, State, StateContext, StateToken, Selector } from '@ngxs/store'
import { Injectable } from '@angular/core'
import { IGameSettingStateModel } from './api/game-settings-state-model'
import { UpdateFirstPairingMode, UpdateSecondPairingMode, UpdateCategory, UseAllCategories, UpdateNumberOfOptions, UpdateNumberOfRounds } from './game-settings-actions'
import { CardContent } from '../../../../../games/src/lib/api/card-content'
import { Category } from '../../category/api/category'

const stateToken: StateToken<IGameSettingStateModel> = new StateToken<IGameSettingStateModel>("gameSettingsState")

@State({
    name: stateToken,
    defaults: {
        numberOfOptions: 3,
        pairingMode: { 
            first: CardContent.WORD,
            second: CardContent.WORD,
        },
        category: Category.BILDBEGREPP,
        numberOfRounds: 5,
    },
})

@Injectable()
export class GameSettingsState {

    // Selector to get the number of options
    @Selector()
    static getNumberOfOptions(state: IGameSettingStateModel): number {
        return state.numberOfOptions;
    }

    // Selector to get the category
    @Selector()
    static getCategory(state: IGameSettingStateModel): Category {
        return state.category;
    }

    // Selector to get the mode of the first pairing card
    @Selector()
    static getFirstPairingMode(state: IGameSettingStateModel): CardContent {
        return state.pairingMode.first;
    }

    // Selector to get the mode of the second pairing card
    @Selector()
    static getSecondPairingMode(state: IGameSettingStateModel): CardContent {
        return state.pairingMode.second;
    }


    @Action(UpdateFirstPairingMode)
    updateFirstPairingMode(ctx: StateContext<IGameSettingStateModel>, action: UpdateFirstPairingMode):void {
        const state: IGameSettingStateModel = ctx.getState();
        
        ctx.patchState({
          pairingMode: {
            ...state.pairingMode,
            first: action.payload
          }
        });
      }

    @Action(UpdateSecondPairingMode)
    updateSecondPairingMode(ctx: StateContext<IGameSettingStateModel>, action: UpdateSecondPairingMode): void {
        const state: IGameSettingStateModel = ctx.getState();
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

    @Action(UpdateNumberOfOptions)
    public updateNumberOfOptions(
        {patchState}: StateContext<IGameSettingStateModel>,
        {numberOfOptions}: UpdateNumberOfOptions
    ) : void {

        //Lägg till funktionell kod här
        patchState({numberOfOptions: numberOfOptions})
    }

    @Action(UpdateNumberOfRounds)
    public updateNumberOfRounds(
        {patchState}: StateContext<IGameSettingStateModel>,
        {numberOfRounds}: UpdateNumberOfRounds
    ) : void {

        //Lägg till funktionell kod här
        patchState({numberOfRounds: numberOfRounds})
    }
}