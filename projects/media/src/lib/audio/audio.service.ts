import {inject, Injectable} from "@angular/core";
import {Howl, Howler} from "howler";
import {IPlaylistAudio} from "./api/playlist";
import {ResetCurrentlyPlayingKey, UpdateCurrentAudioLength} from "./state/audio-state-actions";
import {Store} from "@ngxs/store";

@Injectable({
  providedIn: "root",
})
export class AudioService {
  private sounds: {[key: string]: Howl} = {};
  private currentAudio: Howl;
  private store: Store = inject(Store);

  /**
   * Loads an audio file.
   * @param key Unique key to identify the sound.
   * @param src Source URL of the audio file.
   * @returns Length of the audio file in seconds.
   */
  public loadSound(key: string, src: string): number {
    if (this.sounds[key]) {
      console.debug(`Sound with key ${key} already loaded.`);
      return this.sounds[key].duration();
    }

    this.sounds[key] = new Howl({
      src: [src],
      volume: 0.4,
    });

    return this.sounds[key].duration();
  }

  public isSoundLoaded(key: string): boolean {
    return this.sounds[key] !== undefined;
  }

  public stopAllSounds(): void {
    for (const key in this.sounds) {
      if (Object.prototype.hasOwnProperty.call(this.sounds, key)) {
        this.sounds[key].stop();
      }
    }
  }

  /**
   * Plays the audio.
   * @param key Unique key of the sound to play.
   * @param isSoundEnabled
   */
  public playSound(key: string, isSoundEnabled: boolean): void {
    const sound: Howl = this.sounds[key];

    if (sound) {
      if (!sound.playing()) {
        sound.mute(!isSoundEnabled);
        this.store.dispatch(new UpdateCurrentAudioLength(sound.duration()));

        sound.play();
        this.currentAudio = sound;

        sound.on("end", (): void => {
          this.store.dispatch(new ResetCurrentlyPlayingKey());
        });
      } else {
        console.warn(`Sound with key ${key} is already playing.`);
      }
    } else {
      console.error(`Sound with key ${key} not found.`);
    }
  }

  public muteCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.mute(true);
    }
  }

  public unmuteCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.mute(false);
    }
  }

  public updateCurrentMuteStatus(muted: boolean): void {
    if (this.currentAudio) {
      this.currentAudio.mute(muted);
    }
  }

  /**
   * Pauses the audio.
   * @param key Unique key of the sound to pause.
   */
  public pauseSound(key: string): void {
    const sound: Howl = this.sounds[key];
    if (sound) {
      sound.pause();
    } else {
      console.error(`Sound with key ${key} not found.`);
    }
  }

  /**
   * Stops the audio.
   * @param key Unique key of the sound to stop.
   */
  public stopSound(key: string): void {
    const sound: Howl = this.sounds[key];
    if (sound) {
      sound.stop();
    } else {
      console.error(`Sound with key ${key} not found.`);
    }
  }

  /**
   * Unloads a sound.
   * @param key Unique key of the sound to unload.
   */
  public unloadSound(key: string): void {
    const sound: Howl = this.sounds[key];
    if (sound) {
      sound.unload();
      delete this.sounds[key];
    } else {
      console.error(`Sound with key ${key} not found.`);
    }
  }

  /**
   * Sets the volume for all sounds.
   * @param volume Volume level (0.0 to 1.0).
   */
  public setVolume(volume: number): void {
    Howler.volume(volume);
  }

  /**
   * Mutes all sounds.
   * @param mute True to mute, false to unmute.
   */
  public mute(mute: boolean): void {
    Howler.mute(mute);
  }

  public playEntirePlaylist(keys: IPlaylistAudio[], isSoundEnabled: boolean): void {
    keys.forEach((key: IPlaylistAudio, index: number): void => {
      const sound: Howl = this.sounds[key.audio.name];
      if (sound) {
        sound.once("end", (): void => {
          if (index === keys.length - 1) {
            this.playEntirePlaylist(keys, isSoundEnabled);
          }
        });
        sound.mute(!isSoundEnabled);
        sound.play();
      }
    });
  }
}
