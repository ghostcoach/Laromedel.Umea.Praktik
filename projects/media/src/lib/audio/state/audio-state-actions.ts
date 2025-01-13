import {IAudio} from "../api/audio";
import {IBackgroundAudio} from "../api/background-audio";
import {IPlaylistAudio} from "../api/playlist";
import {PlaylistPlaybackMode} from "../api/playlist-playback-mode";

export class ToggleSound {
  static readonly type = "[Audio] Toggle Sound";
}

export class UpdateIsSoundEnabled {
  static readonly type = "[Audio] Update Is Sound Enabled";

  constructor(public isSoundEnabled: boolean) {}
}

export class PlayAudio {
  static readonly type = "[Audio] Play Audio";

  constructor(public audio: IAudio) {}
}

export class StopAudio {
  static readonly type = "[Audio] Stop Audio";
}

export class StartBackgroundLoop {
  static readonly type = "[Audio] Start Background Loop";

  constructor(public backgroundAudio: IBackgroundAudio) {}
}

export class StopBackgroundLoop {
  static readonly type = "[Audio] Stop Background Loop";
}

export class FadeOutBackgroundLoop {
  static readonly type = "[Audio] Fade Out Background Loop";
}

export class LoadPlaylist {
  static readonly type: string = "[Audio] Load Playlist";

  constructor(public playlist: IPlaylistAudio[]) {}
}

export class IncrementPlaylistIndex {
  static readonly type: string = "[Audio] Increment Playlist Index";
}

export class ResetPlaylist {
  static readonly type: string = "[Audio] Reset Playlist";
}

export class StartPlaylist {
  static readonly type: string = "[Audio] Start Playlist";
}

export class StopPlaylist {
  static readonly type: string = "[Audio] Stop Playlist";
}

export class ContinuePlaylist {
  static readonly type: string = "[Audio] Continue Playlist";
}

export class ResetCurrentlyPlayingKey {
  static readonly type: string = "[Audio] Reset Currently Playing Key";
}

export class UpdatePlaylistPlaybackMode {
  static readonly type: string = "[Audio] Update Playlist Playback Mode";

  constructor(public playListPlaybackMode: PlaylistPlaybackMode) {}
}

export class UpdateIsSoundPlaying {
  static readonly type: string = "[Audio] Update Is Sound Playing";

  constructor(public isSoundPlaying: boolean) {}
}

export class UpdateCurrentAudioLength {
  static readonly type: string = "[Audio] Update Current Audio Length";

  constructor(public currentAudioLength: number) {}
}
