import {IApplicationStateModel} from "../api/application-state-model";
import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {
  IndicateRoutingEvent,
  IndicateUserInteraction,
  ToggleFullscreen,
  UpdateIsWebMSupported,
  UpdateIsWebPSupported,
} from "./application-state-actions";

const stateToken: StateToken<IApplicationStateModel> = new StateToken<IApplicationStateModel>("applicationState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    hasRoutingEventHappened: false,
    hasUserInteracted: false,
    isFullscreen: false,
    isWebMSupported: true,
    isWebPSupported: true,
  },
})
@Injectable()
export class ApplicationState {
  @Action(IndicateRoutingEvent)
  public indicateRoutingEvent({patchState}: StateContext<IApplicationStateModel>): void {
    patchState({hasRoutingEventHappened: true});
  }

  @Action(IndicateUserInteraction)
  public indicateUserInteraction({patchState}: StateContext<IApplicationStateModel>): void {
    patchState({hasUserInteracted: true});
  }

  @Action(ToggleFullscreen)
  public toggleFullscreen({getState, patchState}: StateContext<IApplicationStateModel>): void {
    const currentStatus: boolean = getState().isFullscreen;
    const newStatus: boolean = !currentStatus;

    patchState({isFullscreen: newStatus});

    newStatus ? this.enterFullscreen() : this.exitFullscreen();
  }

  private enterFullscreen(): void {
    const element: HTMLElement = document.documentElement;
    element.requestFullscreen();
  }

  private exitFullscreen(): void {
    document.exitFullscreen();
  }

  @Action(UpdateIsWebMSupported)
  public updateIsWebMSupported({patchState}: StateContext<IApplicationStateModel>, {isWebMSupported}: UpdateIsWebMSupported): void {
    patchState({isWebMSupported});
  }

  @Action(UpdateIsWebPSupported)
  public updateIsWebPSupported({patchState}: StateContext<IApplicationStateModel>, {isWebPSupported}: UpdateIsWebPSupported): void {
    patchState({isWebPSupported});
  }
}
