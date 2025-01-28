import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild} from "@angular/core";
import {Store} from "@ngxs/store";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {MemoryCard} from "@games/memory-card";
import {AudioService} from "@media/audio.service";
import {CardContentComponent} from "./card-content/card-content.component";
import {DealAnimatedCardComponent} from "./deal-animated-card/deal-animated-card.component";
import {CardContent, MemoryGameQueries, SelectMemoryCard} from "@games/memory-game";
import {TimeoutService} from "@utility/timeout.service";
import {AudioStateQueries} from "@media/state/audio-state-queries";
import {SettingsStateQueries} from "../../settings/state/settings-state-queries";
import {MemoryGameConfig} from "@games/memory-game-config";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIf, CardContentComponent, DealAnimatedCardComponent],
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements AfterViewInit, OnDestroy {
  @ViewChild("cardContent", {static: false})
  public cardContent!: CardContentComponent;

  @ViewChild("cardButton", {static: false})
  public cardButton!: ElementRef<HTMLButtonElement>;

  @Input({required: true}) public memoryCard!: MemoryCard;
  @Input({required: true}) public cardBackImage!: string;
  @Input({required: true}) public cardFrontImage!: string;
  @Input({required: true}) public cardIndex!: number;

  public shouldDisappear: boolean = false;
  public isLoaded: boolean = false;

  public readonly isReadyToPlay$: Observable<boolean> = this.store.select(MemoryGameQueries.isReadyToPlay$);
  public readonly visualState$: Observable<string> = this.store
    .select(MemoryGameQueries.cardVisualState$)
    .pipe(map((selector) => selector(this.memoryCard.id)));
  public readonly isOpenCardsPlayMode$: Observable<boolean> = this.store.select(SettingsStateQueries.isOpenCardsPlayMode$);

  constructor(
    private readonly store: Store,
    private readonly audioService: AudioService,
    private readonly timeoutService: TimeoutService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    this.timeoutService.setTimeout((): void => {
      this.isLoaded = true;
    }, 150);

    this.changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.timeoutService.clearAllTimeouts();
  }

  public handleCardSelect(): void {
    this.store.dispatch(new SelectMemoryCard(this.memoryCard));
    this.playMediaContent();
  }

  private playMediaContent(): void {
    this.timeoutService.clearTimeout("media");

    this.timeoutService.setTimeout(
      (): void => {
        if (this.memoryCard.cardContent === CardContent.TAKK) {
          this.cardContent.playVideo();
        } else {
          const isSoundEnabled: boolean = this.store.selectSnapshot(AudioStateQueries.isSoundEnabled$);
          this.audioService.playSound(this.memoryCard.audioName, isSoundEnabled);
        }
      },
      MemoryGameConfig.TIMEOUT_LENGTH_MEDIA_MS,
      "media",
    );
  }
}
