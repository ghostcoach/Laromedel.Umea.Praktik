import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {IAudioStateModel} from "../api/audio-state.model";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {
  FadeOutBackgroundLoop,
  IncrementPlaylistIndex,
  LoadPlaylist,
  PlayAudio,
  ResetCurrentlyPlayingKey,
  ResetPlaylist,
  StartBackgroundLoop,
  StartPlaylist,
  StopAudio,
  StopBackgroundLoop,
  ToggleSound,
  UpdateCurrentAudioLength,
  UpdateIsSoundEnabled,
  UpdateIsSoundPlaying,
  UpdatePlaylistPlaybackMode,
} from "./audio-state-actions";
import {AudioService} from "../audio.service";
import {BackgroundAudioService} from "../background-audio.service";
import {IPlaylistAudio} from "../api/playlist";
import {PlaylistPlaybackMode} from "../api/playlist-playback-mode";
import {LocalStorageService} from "ngx-localstorage";

const stateToken: StateToken<IAudioStateModel> = new StateToken<IAudioStateModel>("audioState");

const defaultState: IAudioStateModel = {
  isSoundEnabled: true,
  isLoopPlaying: false,
  isSoundPlaying: false,
  playlist: [],
  currentPlaylistIndex: 0,
  currentPlayingKey: "",
  currentAudioLength: 0,
  playListPlaybackMode: PlaylistPlaybackMode.PLAY_ENTIRE_PLAYLIST,
};

@UntilDestroy()
@State({
  name: stateToken,
  defaults: defaultState,
})
@Injectable()
export class AudioState {
  private readonly localStorageKey: string = "audioState";

  constructor(
    private audioService: AudioService,
    private backgroundAudioService: BackgroundAudioService,
    private localStorageService: LocalStorageService,
  ) {
    this.hydrateState();
  }

  private hydrateState(): void {
    const storedState: IAudioStateModel | null = this.localStorageService.get<IAudioStateModel>(this.localStorageKey);
    if (!storedState) return;

    Object.assign(defaultState, storedState);
  }

  @Action(UpdateIsSoundEnabled)
  @Action(ToggleSound)
  public saveToLocalStorage({getState}: StateContext<IAudioStateModel>): void {
    setTimeout((): void => {
      const newState: IAudioStateModel = defaultState;
      newState.isSoundEnabled = getState().isSoundEnabled;
      this.localStorageService.set<IAudioStateModel>(this.localStorageKey, newState);
    }, 500);
  }

  @Action(UpdateIsSoundEnabled)
  public updateIsSoundEnabled({patchState}: StateContext<IAudioStateModel>, {isSoundEnabled}: UpdateIsSoundEnabled): void {
    this.audioService.updateCurrentMuteStatus(!isSoundEnabled);
    this.backgroundAudioService.updateCurrentMuteStatus(!isSoundEnabled);
    patchState({isSoundEnabled});
  }

  @Action(ToggleSound)
  public toggleSound({getState, patchState}: StateContext<IAudioStateModel>): void {
    const {isSoundEnabled} = getState();

    const newStatus: boolean = !isSoundEnabled;
    this.audioService.updateCurrentMuteStatus(!newStatus);
    this.backgroundAudioService.updateCurrentMuteStatus(!newStatus);

    patchState({isSoundEnabled: newStatus});
  }

  @Action(PlayAudio)
  public playSound({getState, patchState}: StateContext<IAudioStateModel>, {audio}: PlayAudio): void {
    const isSoundLoaded: boolean = this.audioService.isSoundLoaded(audio.name);

    if (!isSoundLoaded) {
      this.audioService.loadSound(audio.name, audio.src);
    }

    console.log("Queuing audio: ", audio.name);
    this.audioService.queueSound(audio.name);

    patchState({currentPlayingKey: audio.name, isSoundPlaying: true});

    // If no audio is currently playing, start playing immediately
    if (!this.audioService.isAudioPlaying()) {
      this.audioService.playNextSoundInQueue(getState().isSoundEnabled);
    }
  }

  @Action(StopAudio)
  public stopAudio(): void {
    this.audioService.stopAllSounds();
  }

  @Action(StartBackgroundLoop)
  public startBackgroundLoop({patchState}: StateContext<IAudioStateModel>, {backgroundAudio}: StartBackgroundLoop): void {
    this.backgroundAudioService.startLoop(backgroundAudio);
    patchState({isLoopPlaying: true});
  }

  @Action(FadeOutBackgroundLoop)
  public fadeOutBackgroundLoop(): void {
    this.backgroundAudioService.fadeOutLoop();
  }

  @Action(StopBackgroundLoop)
  public stopBackgroundLoop({patchState}: StateContext<IAudioStateModel>): void {
    this.backgroundAudioService.stopLoop();
    patchState({isLoopPlaying: false});
  }

  @Action(LoadPlaylist)
  public loadPlaylist({patchState}: StateContext<IAudioStateModel>, {playlist}: LoadPlaylist): void {
    patchState({playlist});
  }

  @Action(IncrementPlaylistIndex)
  public incrementPlaylistIndex({getState, patchState}: StateContext<IAudioStateModel>): void {
    const {playlist, currentPlaylistIndex} = getState();
    const newIndex: number = currentPlaylistIndex + 1;

    if (newIndex >= playlist.length) {
      patchState({currentPlaylistIndex: 0});
    } else {
      patchState({currentPlaylistIndex: newIndex});
    }
  }

  @Action(ResetPlaylist)
  public resetPlaylist({patchState}: StateContext<IAudioStateModel>): void {
    patchState({currentPlaylistIndex: 0});
  }

  @Action(UpdatePlaylistPlaybackMode)
  public updatePlaylistPlaybackMode(
    {patchState}: StateContext<IAudioStateModel>,
    {playListPlaybackMode}: UpdatePlaylistPlaybackMode,
  ): void {
    patchState({playListPlaybackMode});
  }

  @Action(StartPlaylist)
  public startPlaylist({getState, dispatch}: StateContext<IAudioStateModel>): void {
    const {playlist, currentPlaylistIndex, playListPlaybackMode} = getState();
    const currentAudio: IPlaylistAudio = playlist[currentPlaylistIndex];

    if (playListPlaybackMode === PlaylistPlaybackMode.PLAY_ENTIRE_PLAYLIST) {
      this.audioService.playEntirePlaylist(playlist, getState().isSoundEnabled);
    } else if (playListPlaybackMode === PlaylistPlaybackMode.STOP_AFTER_EACH_AUDIO) {
      this.audioService.playSound(currentAudio.audio.name, getState().isSoundEnabled);
      dispatch(new IncrementPlaylistIndex());
    }
  }

  @Action(ResetCurrentlyPlayingKey)
  public resetCurrentlyPlayingKey({patchState}: StateContext<IAudioStateModel>): void {
    patchState({currentPlayingKey: "", isSoundPlaying: false});
  }

  @Action(UpdateIsSoundPlaying)
  public updateIsSoundPlaying({patchState}: StateContext<IAudioStateModel>, {isSoundPlaying}: UpdateIsSoundPlaying): void {
    patchState({isSoundPlaying});
  }

  @Action(UpdateCurrentAudioLength)
  public updateCurrentAudioLength({patchState}: StateContext<IAudioStateModel>, {currentAudioLength}: UpdateCurrentAudioLength): void {
    patchState({currentAudioLength});
  }
}
