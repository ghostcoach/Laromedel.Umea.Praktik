import {Injectable} from "@angular/core";
import {IApplicationStateModel} from "../api/application-state-model";
import {Selector} from "@ngxs/store";
import {ApplicationState} from "./application-state";

@Injectable()
export class ApplicationStateQueries {
  @Selector([ApplicationState])
  public static hasRoutingEventHappened$(state: IApplicationStateModel): boolean {
    return state.hasRoutingEventHappened;
  }

  @Selector([ApplicationState])
  public static hasUserInteracted$(state: IApplicationStateModel): boolean {
    return state.hasUserInteracted;
  }

  @Selector([ApplicationState])
  public static isAutoPlaySupported$(state: IApplicationStateModel): boolean {
    return state.hasRoutingEventHappened || state.hasUserInteracted;
  }

  @Selector([ApplicationState])
  public static isFullscreen$(state: IApplicationStateModel): boolean {
    return state.isFullscreen;
  }

  @Selector([ApplicationState])
  public static isWebmSupported$(state: IApplicationStateModel): boolean {
    return state.isWebMSupported;
  }

  @Selector([ApplicationState])
  public static isWebpSupported$(state: IApplicationStateModel): boolean {
    return state.isWebPSupported;
  }

  @Selector([ApplicationState])
  public static windowWidth$(state: IApplicationStateModel): number {
    return state.windowWidth;
  }

  @Selector([ApplicationState])
  public static windowHeight$(state: IApplicationStateModel): number {
    return state.windowHeight;
  }
}
