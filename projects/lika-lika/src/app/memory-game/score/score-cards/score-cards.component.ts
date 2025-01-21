import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {GameStateQueries} from "@games/game-state-queries";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ICategory} from "../../../category/api/category";

@UntilDestroy()
@Component({
  selector: "app-score-cards",
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf],
  templateUrl: "./score-cards.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreCardsComponent implements OnInit {
  @Input() isFirstPlayer: boolean = true;
  @Input() category: ICategory;

  public store: Store = inject(Store);
  public playerOneScore$: Observable<number> = this.store.select(GameStateQueries.player1Score$);
  public playerTwoScore$: Observable<number> = this.store.select(GameStateQueries.player2Score$);
  public playerScore$: Observable<number>;

  public ngOnInit(): void {
    this.playerScore$ = this.isFirstPlayer ? this.playerOneScore$ : this.playerTwoScore$;
  }
}
