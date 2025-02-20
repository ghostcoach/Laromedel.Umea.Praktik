import { IStartButtonStateModel } from "./api/start-button-state-model";

export class UpdateStartButtonState {
    static readonly type = '[Start Button] Update Start Button Mode';

    constructor(public payload: IStartButtonStateModel["startBtnActive"]) {}    
}