import {IPlaylistAudio} from "./playlist";
import {PlaylistPlaybackMode} from "./playlist-playback-mode";

export interface IAudioStateModel {
  isSoundEnabled: boolean;
  isSoundPlaying: boolean;
  isLoopPlaying: boolean;
  playlist: IPlaylistAudio[];
  currentPlaylistIndex: number;
  currentPlayingKey: string;
  currentAudioLength: number;
  playListPlaybackMode: PlaylistPlaybackMode;
}
