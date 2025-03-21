import { ICardFullStateModel } from "./api/card-interface";

export class InitializeCardStates {
    static readonly type = '[Card] Initialize Card States';
    constructor(public payload: ICardFullStateModel[]) {}
}
  
export class UpdateAllCards {
    static readonly type = '[Card] Update All Cards';
    constructor(public payload: ICardFullStateModel[]) {}
}
  
export class UpdateCard {
    static readonly type = '[Card] Update Card';
    constructor(public index: number, public payload: Partial<ICardFullStateModel>) {}
}

export class UpdateFlippedClass {
    static readonly type = '[Card] Update Flipped Class';
    constructor(public payload: 'flipped' | 'not-flipped') {}
}