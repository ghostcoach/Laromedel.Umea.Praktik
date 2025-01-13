import { Injectable } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Store } from "@ngxs/store";
import {
  DisplayTextAsSubtitle,
  ResetSubtitleText,
} from "./state/subtitle-actions";

@UntilDestroy()
@Injectable({
  providedIn: "root",
})
export class SubtitleService {
  private twoPartSubtitleTimeout: ReturnType<typeof setTimeout>;
  private subtitleTimeout: ReturnType<typeof setTimeout>;

  constructor(private store: Store) {}

  public initTrackSubtitle = (trackElement: HTMLTrackElement): void => {
    trackElement.track.mode = "hidden";

    trackElement.addEventListener("cuechange", (event: Event): void => {
      const target: HTMLTrackElement = event.target as HTMLTrackElement;
      const cues: TextTrackCueList | null = target.track.activeCues;

      if (cues === null || cues.length < 0) return;

      const cue: VTTCue = cues[0] as VTTCue;

      if (!cue) return;

      const trackDuration: number = cue.endTime - cue.startTime;

      this.store.dispatch(new DisplayTextAsSubtitle(cue.text, trackDuration));
    });
  };

  public resetSubtitles(): void {
    clearTimeout(this.twoPartSubtitleTimeout);
    clearTimeout(this.subtitleTimeout);
    this.store.dispatch(new ResetSubtitleText());
  }

  public displayTwoPartSubtitle(
    subtitle: string,
    part1Seconds: number,
    part2Seconds: number,
    delayMilliseconds: number = 1000,
  ): void {
    const part1: string = subtitle.split(";")[0];
    const part2: string = subtitle.split(";")[1];

    this.store.dispatch(new DisplayTextAsSubtitle(part1, part1Seconds));

    this.twoPartSubtitleTimeout = setTimeout(
      () => {
        this.store.dispatch(new DisplayTextAsSubtitle(part2, part2Seconds));
      },
      part1Seconds * 1000 + delayMilliseconds,
    );
  }
}
