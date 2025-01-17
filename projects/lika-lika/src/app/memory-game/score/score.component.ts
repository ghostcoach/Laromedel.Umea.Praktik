import {ChangeDetectionStrategy, Component, inject, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {GameStateQueries} from "@games/game-state-queries";
import {NgClass} from "@angular/common";
import {ScoreCircleComponent} from "./score-circle/score-circle.component";

@UntilDestroy()
@Component({
  selector: "app-score",
  standalone: true,
  imports: [NgClass, ScoreCircleComponent],
  templateUrl: "./score.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  @Input() isFirstPlayer: boolean = true;

  public store: Store = inject(Store);
  public playerOneScore$: Observable<number> = this.store.select(GameStateQueries.player1Score$);
  public playerTwoScore$: Observable<number> = this.store.select(GameStateQueries.player2Score$);
}
