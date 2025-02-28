import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild} from "@angular/core";
import {Store} from "@ngxs/store";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {DealAnimatedCardComponent} from "./deal-animated-card/deal-animated-card.component";
import {TimeoutService} from "@utility/timeout-service";
import {PlayAudio} from "@media/audio-actions";
import {CardFrontComponent} from "./card-front/card-front.component";
import {MemoryCard} from "../api/memory-card";
import {MemoryGameQueries} from "../state/memory-game-queries";
import {MemorySettingsStateQueries} from "../state/memory-settings-state-queries";
import {SelectMemoryCard} from "../state/memory-game-actions";
import {CardContent} from "../api/card-content";
import {MemoryGameConfig} from "../api/memory-game-config";
import {getCardSizeClasses} from "./card-util";

@Component({
  selector: "lib-card",
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIf, DealAnimatedCardComponent, CardFrontComponent],
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements AfterViewInit, OnDestroy {
  @ViewChild("cardFront", {static: false})
  public cardFrontComponent!: CardFrontComponent;

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
  public readonly isOpenCardsPlayMode$: Observable<boolean> = this.store.select(MemorySettingsStateQueries.isOpenCardsPlayMode$);
  public numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);

  constructor(
    private readonly store: Store,
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
    this.timeoutService.setTimeout(
      (): void => {
        if (this.memoryCard.cardContent === CardContent.TAKK) {
          this.cardFrontComponent.playVideo();
        } else {
          this.store.dispatch(new PlayAudio(this.memoryCard.audio));
        }
      },
      MemoryGameConfig.TIMEOUT_LENGTH_MEDIA_MS,
      "media-" + this.memoryCard.id,
    );
  }

  protected readonly getCardSizeClasses = getCardSizeClasses;
}
