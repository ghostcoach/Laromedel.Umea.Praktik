import { Injectable } from "@angular/core";
import { Selector } from '@ngxs/store'
import { CardStates } from "./card.state";
import { IMultipleFullStateModel, ICardFullStateModel } from "./api/card-interface";

@Injectable()
export class CardStateQueries {

    @Selector([CardStates])
    public static cardStates$(state: IMultipleFullStateModel) : ICardFullStateModel[] {
        return state.cardStates
    }

    @Selector([CardStates])
    public static mode$(state: IMultipleFullStateModel) : string[] {
        return state.cardStates.map(card => card.mode);
    }

    @Selector([CardStates])
    public static contentMedium$(state: IMultipleFullStateModel) : string[] {
        return state.cardStates.map(card => card.contentMedium);
    }

    @Selector([CardStates])
    public static content$(state: IMultipleFullStateModel) : string[] {
        return state.cardStates.map(card => card.content);
    }

    @Selector([CardStates])
    public static audioPath$(state: IMultipleFullStateModel) : string[] {
        return state.cardStates.map(card => card.audioPath);
    }

    @Selector([CardStates])
    public static flippedClass$(state: IMultipleFullStateModel) : string[] {
        return state.cardStates.map(card => card.flippedClass);
    }

    @Selector([CardStates])
    public static correctClass$(state: IMultipleFullStateModel) : string[] {
        return state.cardStates.map(card => card.correctClass);
    }

    @Selector([CardStates])
    public static word$(state: IMultipleFullStateModel) : string[] {
        return state.cardStates.map(card => card.word);
    }

}