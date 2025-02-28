import {AfterViewInit, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {RegisterDealtCard} from "../../state/memory-game-actions";
import {AsyncPipe, NgClass} from "@angular/common";
import {getCardSizeClasses} from "../card-util";
import {Observable} from "rxjs";
import {MemorySettingsStateQueries} from "../../state/memory-settings-state-queries";

interface DealTimingConfiguration {
  readonly min: number;
  readonly max: number;
  readonly minPlus: number;
  readonly maxPlus: number;
  readonly plusLimit: number;
}

interface PositionConfiguration {
  readonly widthPercentage: number;
  readonly heightPercentage: number;
}

interface AnimationTiming {
  readonly length: number;
  readonly extraDelay: number;
  readonly untiltDelay: number;
}

@Component({
  selector: "lib-deal-animated-card",
  standalone: true,
  templateUrl: "./deal-animated-card.component.html",
  styleUrl: "./deal-animated-card.component.scss",
  imports: [AsyncPipe, NgClass],
})
export class DealAnimatedCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({required: true}) cardButton!: HTMLButtonElement;
  @Input() cardBackImage!: string;
  @Input({required: true}) cardIndex!: number;

  public positionX: number = 10;
  public positionY: number = 50;
  public sourceCardPositionX: number = 0;
  public sourceCardPositionY: number = 0;
  public shouldTilt: boolean = true;
  public isEvenCardTilt: boolean = false;

  public numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);

  private readonly dealTimingConfig: DealTimingConfiguration = {
    min: 950,
    max: 1100,
    minPlus: 1150,
    maxPlus: 1900,
    plusLimit: 9,
  };

  private readonly positionConfig: PositionConfiguration = {
    widthPercentage: 0.05,
    heightPercentage: 0.5,
  };

  private readonly animationTiming: AnimationTiming = {
    length: 2000,
    extraDelay: 250,
    untiltDelay: 200,
  };

  private dealOutMin: number = 0;
  private dealOutMax: number = 0;
  private dealingTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(private store: Store) {
    this.isEvenCardTilt = this.generateRandomBoolean();
  }

  ngOnInit(): void {
    this.calculateDealTimings();
    this.initializeStartPosition();
  }

  ngAfterViewInit(): void {
    this.captureTargetPosition();
    this.startDealAnimation();
  }

  ngOnDestroy(): void {
    this.clearDealingTimeout();
  }

  private calculateDealTimings(): void {
    const {plusLimit, min, max, minPlus, maxPlus}: DealTimingConfiguration = this.dealTimingConfig;
    const useExtendedTiming: boolean = this.cardIndex >= plusLimit;

    this.dealOutMin = useExtendedTiming ? minPlus : min;
    this.dealOutMax = useExtendedTiming ? maxPlus : max;
  }

  private initializeStartPosition(): void {
    this.positionX = window.innerWidth * this.positionConfig.widthPercentage;
    this.positionY = window.innerHeight * this.positionConfig.heightPercentage;
  }

  private startDealAnimation(): void {
    const delay: number = this.getRandomDelay(this.dealOutMin, this.dealOutMax);

    this.dealingTimeout = setTimeout((): void => {
      this.removeCardTilt();
      this.animateToTargetPosition();
    }, delay);
  }

  private captureTargetPosition(): void {
    if (!this.cardButton) {
      throw new Error("Card target element is required");
    }

    const rect: DOMRect = this.cardButton.getBoundingClientRect();
    this.sourceCardPositionX = rect.x;
    this.sourceCardPositionY = rect.y;
  }

  private animateToTargetPosition(): void {
    this.positionX = this.sourceCardPositionX;
    this.positionY = this.sourceCardPositionY;

    setTimeout((): void => {
      this.store.dispatch(new RegisterDealtCard());
      this.shouldTilt = false;
    }, this.animationTiming.length + this.animationTiming.extraDelay);
  }

  private removeCardTilt(): void {
    setTimeout((): void => {
      this.shouldTilt = false;
    }, this.animationTiming.untiltDelay);
  }

  private generateRandomBoolean(): boolean {
    return Math.random() >= 0.5;
  }

  private getRandomDelay(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private clearDealingTimeout(): void {
    if (this.dealingTimeout) {
      clearTimeout(this.dealingTimeout);
      this.dealingTimeout = undefined;
    }
  }

  protected readonly getCardSizeClasses = getCardSizeClasses;
}
