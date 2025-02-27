import { IPairingMode } from "@games/*"
import { Category, SubjectArea } from "../../../category/api/category"

export interface IGameSettingStateModel {
    numberOfOptions: number,
    pairingMode: IPairingMode,
    subjectArea: SubjectArea,
    category: Category,
    numberOfRounds: number
}

// export interface IPairingMode {
//     first: CardContent;
//     second: CardContent; 
// }

// export declare enum CardContent {
//     WORD = "ord",
//     ILLUSTRATION = "bild",
//     RITADE_TECKEN = "ritade tecken",
//     TAKK = "tecken som st\u00F6d"
// }