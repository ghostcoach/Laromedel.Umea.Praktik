import {VideoStatus} from "../api/video-status";

export class UpdateVideoStatus {
  static readonly type: string = "[Video] Update Video Status";

  constructor(public status: VideoStatus) {}
}

export class ResetVideo {
  static readonly type: string = "[Video] Reset Video";
}

export class ToggleVideoStatus {
  static readonly type: string = "[Video] Toggle Video Status";
}

export class PlayVideo {
  static readonly type: string = "[Video] Play Video";
}

export class PauseVideo {
  static readonly type: string = "[Video] Pause Video";
}

export class ReplayVideo {
  static readonly type: string = "[Video] Replay Video";
}

export class JumpToTimestamp {
  static readonly type: string = "[Video] Jump to Timestamp";

  constructor(public jumpToTimestamp: number) {}
}

export class JumpAhead {
  static readonly type: string = "[Video] Jump Ahead";
  static readonly SECONDS_TO_JUMP: number = 5;
}

export class JumpBack {
  static readonly type: string = "[Video] Jump Back";
  static readonly SECONDS_TO_JUMP: number = 5;
}
