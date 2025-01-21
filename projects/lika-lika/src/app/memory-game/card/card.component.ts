import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MemoryCard} from "@games/memory-card";
import {Store} from "@ngxs/store";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgClass} from "@angular/common";
import {CardContentComponent} from "./card-content/card-content.component";
import {AudioService} from "@media/audio.service";
import {MemoryGameQueries} from "@games/memory-game-queries";
import {ProcessSelectedMemoryCards, SelectMemoryCard} from "@games/memory-game-actions";
import {MemoryGameState} from "@games/memory-game-state";
import {CardContent} from "@games/card-content";
import {AudioStateQueries} from "@media/audio-state-queries";
import {SettingsStateQueries} from "../../settings/state/settings-state-queries";

@UntilDestroy()
@Component({
  selector: "app-card",
  standalone: true,
  imports: [AsyncPipe, NgClass, CardContentComponent],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
})
export class CardComponent implements AfterViewInit, OnDestroy {
  @ViewChild("cardContent") public cardContent: CardContentComponent;

  @Input() public memoryCard: MemoryCard;
  @Input() public cardBackImage: string;
  @Input() public cardFrontImage: string;

  public shouldDisappear: boolean = false;

  private cardMediaTimeout: ReturnType<typeof setTimeout>;
  private cardProcessTimeout: ReturnType<typeof setTimeout>;
  private disappearTimeout: ReturnType<typeof setTimeout>;
  private mediaDurationMs: number;

  public isSelected$: Observable<boolean> = this.store
    .select(MemoryGameQueries.isMemoryCardSelected$)
    .pipe(map((isSelectedFn: (id: string) => boolean): boolean => isSelectedFn(this.memoryCard.id)));

  public isMatched$: Observable<boolean> = this.store
    .select(MemoryGameQueries.isMemoryCardMatched$)
    .pipe(map((isMatchedFn: (id: string) => boolean): boolean => isMatchedFn(this.memoryCard.id)));

  public hasMatchError$: Observable<boolean> = this.store.select(MemoryGameQueries.hasMatchError$);

  public isOpenCardsPlayMode$: Observable<boolean> = this.store.select(SettingsStateQueries.isOpenCardsPlayMode$);

  constructor(
    private store: Store,
    private audioService: AudioService,
  ) {}

  public ngAfterViewInit(): void {
    this.loadCardMedia();
  }

  private loadCardMedia(): void {
    if (this.memoryCard.cardContent === CardContent.TAKK) {
      this.mediaDurationMs = this.cardContent.loadVideo() * 1000;
      return;
    }
    this.mediaDurationMs = this.audioService.loadSound(this.memoryCard.audioName, this.memoryCard.audioSrc) * 1000;
  }

  public ngOnDestroy(): void {
    clearTimeout(this.cardMediaTimeout);
    clearTimeout(this.disappearTimeout);
    clearTimeout(this.cardProcessTimeout);
  }

  public handleCardSelect(): void {
    this.store.dispatch(new SelectMemoryCard(this.memoryCard));

    this.playCardMedia();
  }

  private playCardMedia(): void {
    clearTimeout(this.cardMediaTimeout);

    this.cardMediaTimeout = setTimeout((): void => {
      this.memoryCard.cardContent === CardContent.TAKK
        ? this.cardContent.playVideo()
        : this.audioService.playSound(this.memoryCard.audioName, this.store.selectSnapshot(AudioStateQueries.isSoundEnabled$));
    }, MemoryGameState.TIMEOUT_LENGTH_MEDIA_MS);
  }

  private processCardSelection(): void {
    this.cardProcessTimeout = setTimeout((): void => {
      this.store.dispatch(new ProcessSelectedMemoryCards());
    }, MemoryGameState.TIMEOUT_LENGTH_MEDIA_MS + this.mediaDurationMs);
  }
}
