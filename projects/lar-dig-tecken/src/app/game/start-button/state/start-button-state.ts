// import { Action, State, StateContext, StateToken, Selector } from '@ngxs/store'
// import { Injectable } from '@angular/core'
// import { IStartButtonStateModel } from './api/start-button-state-model'
// import { UpdateStartButtonState } from './start-button-actions'
// // import { StartButtonState } from './start-button-state'


// const stateToken: StateToken<IStartButtonStateModel> = new StateToken<IStartButtonStateModel>("startBtnActive")

// @State({
//     name: stateToken,
//     defaults: {
//         startBtnActive: true
//     }
// })

// @Injectable()
// export class StartButtonState {
//     @Action(UpdateStartButtonState)
//     updateStartButtonMode(
//         ctx: StateContext<IStartButtonStateModel>, 
//         action: UpdateStartButtonState):void {        
//             ctx.patchState({
//                 startBtnActive: action.payload
//             });
//       }

//     @Selector()
//     static getStartButtonMode(state: IStartButtonStateModel): boolean {
//         return state.startBtnActive;
//     }
// }