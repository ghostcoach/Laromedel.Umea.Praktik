import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import { SelectedGame } from "../api/selected-game";
import {ISelectedGameStateModel} from '../api/selected-game-state-model'
import { UpdateSelectedGame } from "./selected-game-state-actions";

const stateToken: StateToken<ISelectedGameStateModel> = new StateToken<ISelectedGameStateModel>("selectedGameState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    selectedGame: SelectedGame.SLUMPGENERATOR,
  },
})
@Injectable()
export class SelectedGameState {
  @Action(UpdateSelectedGame)
  public updateSelectedGame({patchState}: StateContext<ISelectedGameStateModel>, {selectedGame}: UpdateSelectedGame): void {
    patchState({selectedGame});
  }
}
