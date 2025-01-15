import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {PlayMode} from "@games/play-mode";
import {Store} from "@ngxs/store";
import {SettingsStateQueries} from "../state/settings-state-queries";
import {Observable} from "rxjs";

@UntilDestroy()
@Component({
  selector: "app-eye-animation",
  standalone: true,
  template: `<img [src]="iconSrc" alt="Välj att spela med stängda eller öppna kort" class="w-3/4 mx-auto" />`,
})
export class EyeAnimationComponent implements OnInit {
  private startIndex: number = 0;

  private images: string[] = [
    "assets/layout/icons/eyes/eye-1.svg",
    "assets/layout/icons/eyes/eye-2.svg",
    "assets/layout/icons/eyes/eye-3.svg",
    "assets/layout/icons/eyes/eye-4.svg",
    "assets/layout/icons/eyes/eye-5.svg",
    "assets/layout/icons/eyes/eye-6.svg",
  ];

  public iconSrc!: string;
  private index: number = 5;
  private currentGamePlayMode!: PlayMode;
  private firstLoad: boolean = true;
  private isAnimating: boolean = false;

  public playMode$: Observable<PlayMode> = this.store.select(SettingsStateQueries.playMode$);

  constructor(
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.playMode$.pipe(untilDestroyed(this)).subscribe((playMode: PlayMode): void => {
      this.setGamePlayMode(playMode);
    });
  }

  private setGamePlayMode(playMode: PlayMode): void {
    this.currentGamePlayMode = playMode;
    this.startIndex = playMode === PlayMode.FLIP_CARDS ? 5 : 0;

    if (this.firstLoad) {
      this.iconSrc = this.images[this.startIndex];
      this.firstLoad = false;
      return;
    }

    this.animateEyes();
  }

  private async animateEyes(): Promise<void> {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const value: number = this.currentGamePlayMode === PlayMode.FLIP_CARDS ? 1 : -1;

    this.index = this.index === -1 ? 0 : this.index === 6 ? 5 : this.index;

    while (this.index > -1 && this.index < 6) {
      this.iconSrc = this.images[this.index];
      this.changeDetectorRef.detectChanges();
      this.index = this.index + value;
      console.debug("index", this.index, this.iconSrc);

      await new Promise((r) => setTimeout(r, 100));
    }

    this.isAnimating = false;
  }
}
