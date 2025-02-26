import { IFlippedStateModel } from "./api/card-interface";

export class UpdateFlippedState {
    static readonly type = '[Flipped] Update Flipped State';
    constructor(public payload: IFlippedStateModel) {}
}