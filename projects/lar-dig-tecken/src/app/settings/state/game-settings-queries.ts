import { Injectable } from "@angular/core";
import { Selector } from '@ngxs/store'
import { GameSettingsState } from "./game-settings-state";
import { IGameSettingStateModel } from "./api/game-settings-state-model";

@Injectable()
export class GameSettingsStateQueries {
    @Selector([GameSettingsState])
    public static pairingModeFirstCard$(state: IGameSettingStateModel) : string {
        return state.pairingMode.first
    }

    @Selector([GameSettingsState])
    public static pairingModeSecondCard$(state: IGameSettingStateModel) : string {
        return state.pairingMode.second
    }

    @Selector([GameSettingsState])
    public static subjectArea$(state: IGameSettingStateModel) : string {
        return state.subjectArea
    }

    @Selector([GameSettingsState])
    public static category$(state: IGameSettingStateModel) : string {
        return state.category
    }

    @Selector([GameSettingsState])
    public static numberOfRounds$(state: IGameSettingStateModel) : number {
        return state.numberOfRounds
    }

    @Selector([GameSettingsState])
    public static numberOfOptions$(state: IGameSettingStateModel) : number {
        return state.numberOfOptions
    }

}