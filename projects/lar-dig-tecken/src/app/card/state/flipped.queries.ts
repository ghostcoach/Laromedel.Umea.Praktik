import { Injectable } from "@angular/core";
import { Selector } from '@ngxs/store'
import { FlippedState } from "./flipped.state";
import { IFlippedStateModel } from "./api/card-interface";

@Injectable()
export class FlippedStateQueries {

    @Selector([FlippedState])
    public static flippedClass$(state: IFlippedStateModel) : string {
        return state.flippedClass;
    }

}