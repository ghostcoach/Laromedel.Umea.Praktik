import { Injectable } from "@angular/core";
import { Selector } from '@ngxs/store'
import { CardState } from "./card-state";
import { IMultipleCardStatesModel, ICardStateModel } from "./api/card-interface";


@Injectable()
export class CardStateQueries {

    @Selector([CardState])
    public static cardStates$(state: IMultipleCardStatesModel) : ICardStateModel[] {
        return state.cardStates
    }

    @Selector([CardState])
    public static isFlipped$(state: IMultipleCardStatesModel) : boolean[] {
        return state.cardStates.map(card => card.isFlipped);
    }

    @Selector([CardState])
    public static isSelected$(state: IMultipleCardStatesModel) : boolean[] {
        return state.cardStates.map(card => card.isSelected);
    }

    @Selector([CardState])
    public static isCorrect$(state: IMultipleCardStatesModel) : boolean[] {
        return state.cardStates.map(card => card.isCorrect);
    }

}