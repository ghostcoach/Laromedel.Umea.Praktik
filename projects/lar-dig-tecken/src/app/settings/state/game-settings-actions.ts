import { IGameSettingStateModel } from "../state/api/game-settings-state-model";
import { CardContent } from "@games/*";

export class UpdateFirstPairingMode {
    static readonly type = '[Game Settings] Update First Pairing Mode';

    constructor(public payload: CardContent) {}
}

export class UpdateSecondPairingMode {
    static readonly type = '[Game Settings] Update Second Pairing Mode';

    constructor(public payload: CardContent) {}}

export class UpdateCategory {
    static readonly type: string = '[Pairing] Update Category';

    constructor(public category: IGameSettingStateModel["category"]) {}
}

export class UseAllCategories {
    static readonly type: string = '[Pairing] Use All Categories';

    constructor(public useAllCategories: IGameSettingStateModel["category"]) {}
}