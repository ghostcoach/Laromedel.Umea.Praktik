export interface IApplicationStateModel {
  hasRoutingEventHappened: boolean;
  hasUserInteracted: boolean;
  isFullscreen: boolean;
  isWebMSupported: boolean;
  isWebPSupported: boolean;
  windowWidth: number;
  windowHeight: number;
}
