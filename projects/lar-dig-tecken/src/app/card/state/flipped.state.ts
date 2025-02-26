import { Injectable } from '@angular/core';
import { IFlippedStateModel } from './api/card-interface';
import { Action, State, StateContext, Store, Selector, StateToken } from '@ngxs/store'
import { UpdateFlippedState } from './flipped.actions';


const stateToken: StateToken<IFlippedStateModel> = new StateToken<IFlippedStateModel>("flippedState")


@Injectable()
@State<IFlippedStateModel>({
    name: stateToken,
    defaults: {
        flippedClass: 'flipped',
    }
})
export class FlippedState  {
    constructor(private store: Store) {}

    @Selector()
    static getFlippedClass(state: IFlippedStateModel): 'flipped' | 'not-flipped' {
        return state.flippedClass;
    }

    @Action(UpdateFlippedState)
    public updateFlippedState(
        {patchState}: StateContext<IFlippedStateModel>,
        {payload}: UpdateFlippedState
    ) : void {
        patchState(payload);
    }

}
