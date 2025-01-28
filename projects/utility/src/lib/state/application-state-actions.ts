export class IndicateRoutingEvent {
  static readonly type: string = "[Application] Indicate routing event";
}

export class IndicateUserInteraction {
  static readonly type: string = "[Application] Indicate user interaction";
}

export class ToggleFullscreen {
  static readonly type: string = "[Application] Toggle fullscreen";
}

export class UpdateIsWebMSupported {
  static readonly type: string = "[Application] Update Is WebM Supported";

  constructor(public isWebMSupported: boolean) {}
}

export class UpdateIsWebPSupported {
  static readonly type: string = "[Application] Update Is WeP Supported";

  constructor(public isWebPSupported: boolean) {}
}

export class UpdateWindowDimensions {
  static readonly type: string = "[Application] Update window dimensions";

  constructor(
    public windowWidth: number,
    public windowHeight: number,
  ) {}
}
