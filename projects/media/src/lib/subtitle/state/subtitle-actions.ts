import {ISubtitleText} from "../api/subtitle-text";

export class EnableSubtitle {
  static readonly type: string = "[Subtitle] Enable Subtitle";
}

export class DisableSubtitle {
  static readonly type: string = "[Subtitle] Disable Subtitle";
}

export class UpdateIsSubtitleEnabled {
  static readonly type: string = "[Subtitle] Update Is Subtitle Enabled";

  constructor(public isSubtitleEnabled: boolean) {}
}

export class ToggleSubtitles {
  static readonly type: string = "[Subtitle] Toggle Subtitle";
}

export class UpdateSubtitleText {
  static readonly type: string = "[Subtitle] Update Subtitle Text";

  constructor(public subtitleText: ISubtitleText) {}
}

export class ResetSubtitleText {
  static readonly type: string = "[Subtitle] Reset Subtitle Text";
}

export class MakeSubtitleVisible {
  static readonly type: string = "[Subtitle] Make Subtitle Visible";
}

export class HideSubtitle {
  static readonly type: string = "[Subtitle] Hide Subtitle";
}

export class UpdateSubtitleDisplayMode {
  static readonly type: string = "[Subtitle] Update Subtitle Display Mode";

  constructor(public subtitleText: string) {}
}

export class DisplayTextAsSubtitle {
  static readonly type: string = "[Subtitle] Display Subtitle";

  constructor(
    public text: string,
    public durationSeconds: number,
  ) {}
}
