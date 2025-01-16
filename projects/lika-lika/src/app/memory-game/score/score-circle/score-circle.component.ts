import {Component, inject, Input, OnDestroy, OnInit} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {GameStateQueries} from "@games/game-state-queries";

@UntilDestroy()
@Component({
  selector: "app-score-circle",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./score-circle.component.html",
})
export class ScoreCircleComponent implements OnInit, OnDestroy {
  @Input() isFirstPlayer: boolean = true;
  public shouldRotate: boolean = false;
  public rotateTimeout: ReturnType<typeof setTimeout>;

  public store: Store = inject(Store);
  public playerOneScore$: Observable<number> = this.store.select(GameStateQueries.player1Score$);
  public playerTwoScore$: Observable<number> = this.store.select(GameStateQueries.player2Score$);

  public ngOnInit(): void {
    this.isFirstPlayer ? this.setUpSubscriptionToPlayerOneScore() : this.setUpSubscriptionToPlayerTwoScore();
  }

  private setUpSubscriptionToPlayerOneScore(): void {
    this.playerOneScore$.pipe(untilDestroyed(this)).subscribe((score: number): void => {
      if (score === 0) return;

      this.startRotating();
    });
  }

  private setUpSubscriptionToPlayerTwoScore(): void {
    this.playerTwoScore$.subscribe((score: number): void => {
      if (score === 0) return;

      this.startRotating();
    });
  }

  private startRotating(): void {
    this.shouldRotate = !this.shouldRotate;
    this.rotateTimeout = setTimeout((): void => {
      this.shouldRotate = !this.shouldRotate;
    }, 1000);
  }

  public ngOnDestroy(): void {
    clearTimeout(this.rotateTimeout);
  }
}
