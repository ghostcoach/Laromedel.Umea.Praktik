import {ChangeDetectionStrategy, Component, ElementRef, inject, Input, ViewChild} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AsyncPipe, NgIf} from "@angular/common";
import {MemoryCard} from "@games/memory-card";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {SettingsStateQueries} from "../../../settings/state/settings-state-queries";
import {CardContent} from "@games/card-content";

@UntilDestroy()
@Component({
  selector: "app-card-content",
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: "./card-content.component.html",
  styleUrl: "./card-content.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardContentComponent {
  @ViewChild("cardVideo") public cardVideo: ElementRef<HTMLVideoElement>;

  @Input() public memoryCard: MemoryCard;

  public readonly NUMBER_OF_CHAR_FOR_LONG_WORD: number = 14;

  public isUppercaseTextTransform$: Observable<boolean> = inject(Store).select(SettingsStateQueries.isUpperCaseTextTransform$);

  public get isWordContent(): boolean {
    return this.memoryCard.cardContent === CardContent.WORD;
  }

  public get isIllustrationContent(): boolean {
    return this.memoryCard.cardContent === CardContent.ILLUSTRATION;
  }

  public get isRitadeTeckenContent(): boolean {
    return this.memoryCard.cardContent === CardContent.RITADE_TECKEN;
  }

  public get isVideoContent(): boolean {
    return this.memoryCard.cardContent === CardContent.TAKK;
  }

  public get imageSrc(): string {
    return "";
    //return this.memoryCard.cardContent === CardContent.ILLUSTRATION ? this.memoryCard.illustrationImage : this.memoryCard.ritadeTeckenImage;
  }

  public get imageAlt(): string {
    return this.memoryCard.cardContent === CardContent.ILLUSTRATION
      ? `Illustration av ${this.memoryCard.word}`
      : `Ritade tecken för ${this.memoryCard.word}`;
  }

  public playVideo(): void {
    if (!this.cardVideo) return;

    this.cardVideo.nativeElement.play().then((): void => {
      // Do nothing
    });
  }

  public loadVideo(): number {
    if (!this.cardVideo) return 0;

    this.cardVideo.nativeElement.load();

    return this.cardVideo.nativeElement.duration;
  }

  public isLongWord(): boolean {
    return this.memoryCard.word.length > this.NUMBER_OF_CHAR_FOR_LONG_WORD;
  }
}
