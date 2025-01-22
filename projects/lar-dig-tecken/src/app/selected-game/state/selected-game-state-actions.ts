import { SelectedGame, ISelectedGameViewModel } from "../api/selected-game";

export class UpdateSelectedGame {
    static readonly type = '[SelectedGame] Update Selected Game';

    constructor(public selectedGame: SelectedGame) {}
}