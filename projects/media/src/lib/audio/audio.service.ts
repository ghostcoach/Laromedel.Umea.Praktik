import {Injectable} from "@angular/core";
import {Howl, Howler} from "howler";
import {IPlaylistAudio} from "./api/playlist";

@Injectable({
  providedIn: "root",
})
export class AudioService {
  private sounds: {[key: string]: Howl} = {};
  private currentAudio: Howl;
  private audioQueue: string[] = [];

  public queueSound(key: string): void {
    this.audioQueue.push(key);
  }

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
    if (!isSoundEnabled) {
      console.warn(`Sound ${key} is disabled.`);
      return;
    }

    if (!this.isSoundLoaded(key)) {
      console.warn(`Sound ${key} is not loaded.`);
      return;
    }

    this.currentAudio = this.sounds[key];
    this.currentAudio.play();

    this.currentAudio.once("end", () => {
      setTimeout(() => {
        this.playNextSoundInQueue(isSoundEnabled);
      }, 500);
    });
  }

  public isAudioPlaying(): boolean {
    return this.currentAudio && this.currentAudio.playing();
  }

  public playNextSoundInQueue(isSoundEnabled: boolean): void {
    if (this.audioQueue.length > 0) {
      const nextSound: string | undefined = this.audioQueue.shift();
      if (nextSound) {
        this.playSound(nextSound, isSoundEnabled);
      }
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
