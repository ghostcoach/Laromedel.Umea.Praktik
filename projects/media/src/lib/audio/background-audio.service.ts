import { Injectable } from "@angular/core";
import { Howl } from "howler";
import { BackgroundAudioKey } from "./api/background-audio-key";
import { IBackgroundAudio } from "./api/background-audio";
import { Store } from "@ngxs/store";
import { StopBackgroundLoop } from "./state/audio-state-actions";

@Injectable({
  providedIn: "root",
})
export class BackgroundAudioService {
  private sounds: { [key: string]: Howl } = {};
  private introAudio: Howl;
  private backgroundLoop: Howl;
  private fadeOutAudio: Howl;

  constructor(private store: Store) {}

  public startLoop(backgroundAudio: IBackgroundAudio): void {
    this.load(backgroundAudio);

    if (this.introAudio.playing() || this.backgroundLoop.playing()) return;

    setTimeout((): void => {
      this.introAudio.play();

      this.introAudio.on("end", (): void => {
        this.backgroundLoop.loop(true);
        this.backgroundLoop.play();
      });
    }, 100);
  }

  public fadeOutLoop(): void {
    this.backgroundLoop.stop();
    this.fadeOutAudio.play();

    this.fadeOutAudio.on("end", (): void => {
      this.store.dispatch(new StopBackgroundLoop());
    });
  }

  public stopLoop(): void {
    this.stopAllSounds();
    this.unloadAllSounds();
  }

  private load(backgroundAudio: IBackgroundAudio): void {
    this.introAudio = this.loadBackgroundAudio(
      backgroundAudio.contextKey,
      BackgroundAudioKey.INTRO,
      backgroundAudio.introAudioSrc,
      backgroundAudio.isShared,
    );
    this.backgroundLoop = this.loadBackgroundAudio(
      backgroundAudio.contextKey,
      BackgroundAudioKey.LOOP,
      backgroundAudio.loopAudioSrc,
      backgroundAudio.isShared,
    );

    this.fadeOutAudio = this.loadBackgroundAudio(
      backgroundAudio.contextKey,
      BackgroundAudioKey.FADE_OUT,
      backgroundAudio.fadeOutAudioSrc,
      backgroundAudio.isShared,
    );
  }

  private loadBackgroundAudio(
    contextKey: string,
    backgroundKey: BackgroundAudioKey,
    audioSrc: string,
    isShared: boolean,
  ): Howl {
    const identifier: string = isShared
      ? "shared"
      : this.generateIdentifier(contextKey, backgroundKey);

    return this.loadSound(identifier, audioSrc);
  }

  public updateCurrentMuteStatus(isMuted: boolean): void {
    this.introAudio?.mute(isMuted);
    this.backgroundLoop?.mute(isMuted);
    this.fadeOutAudio?.mute(isMuted);
  }

  private stopAllSounds(): void {
    this.introAudio?.stop();
    this.backgroundLoop?.stop();
    this.fadeOutAudio?.stop();
  }

  private unloadAllSounds(): void {
    this.introAudio?.unload();
    this.backgroundLoop?.unload();
    this.fadeOutAudio?.unload();
  }

  private generateIdentifier(
    key: string,
    backgroundAudioKey: BackgroundAudioKey,
  ): string {
    return `${key}-${backgroundAudioKey}`;
  }

  private loadSound(key: string, src: string): Howl {
    if (this.sounds[key]) {
      console.debug(`Sound with key ${key} already loaded.`);
      this.sounds[key].load();
      return this.sounds[key];
    }

    const sound: Howl = new Howl({
      src: [src],
      volume: 0.38,
      preload: true,
    });

    this.sounds[key] = sound;

    return sound;
  }
}
