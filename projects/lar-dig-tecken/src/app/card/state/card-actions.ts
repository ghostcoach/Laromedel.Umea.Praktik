import { ICardStateModel } from "./api/card-interface";

export class InitializeCardStates {
    static readonly type = '[Card] Initialize Card States';
    constructor(public payload: ICardStateModel[]) {}
  }
  
  export class UpdateAllCards {
    static readonly type = '[Card] Update All Cards';
    constructor(public payload: Partial<ICardStateModel>) {}
  }
  
  export class UpdateCard {
    static readonly type = '[Card] Update Card';
    constructor(public index: number, public payload: Partial<ICardStateModel>) {}
  }