import { Injectable } from "@angular/core";
import { Selector } from '@ngxs/store'
import { StartButtonState } from "./start-button-state";
import { IStartButtonStateModel } from "./api/start-button-state-model";

@Injectable()
export class StartButtonStateQueries {
    @Selector([StartButtonState])
    public static startBtnActive$(state: IStartButtonStateModel) : boolean {
        return state?.startBtnActive ?? true;
    }

}