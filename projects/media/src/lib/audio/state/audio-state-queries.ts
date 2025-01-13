import {Injectable} from "@angular/core";
import {Selector} from "@ngxs/store";
import {AudioState} from "./audio-state";
import {IAudioStateModel} from "../api/audio-state.model";
import {PlaylistPlaybackMode} from "../api/playlist-playback-mode";

@Injectable()
export class AudioStateQueries {
  @Selector([AudioState])
  public static isSoundEnabled$(state: IAudioStateModel): boolean {
    return state.isSoundEnabled;
  }

  @Selector([AudioState])
  public static isLoopPlaying$(state: IAudioStateModel): boolean {
    return state.isLoopPlaying;
  }

  @Selector([AudioState])
  public static playlistPlaybackMode$(state: IAudioStateModel): PlaylistPlaybackMode {
    return state.playListPlaybackMode;
  }

  @Selector([AudioState])
  public static currentlyPlayingKey$(state: IAudioStateModel): string {
    return state.currentPlayingKey;
  }

  @Selector([AudioState])
  public static isSoundPlaying$(state: IAudioStateModel): boolean {
    return state.isSoundPlaying;
  }

  @Selector([AudioState])
  public static currentAudioLength$(state: IAudioStateModel): number {
    return state.currentAudioLength;
  }
}
