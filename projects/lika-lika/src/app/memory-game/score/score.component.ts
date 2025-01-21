import {ChangeDetectionStrategy, Component, inject, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {NgClass} from "@angular/common";
import {ScoreCircleComponent} from "./score-circle/score-circle.component";
import {ScoreCardsComponent} from "./score-cards/score-cards.component";
import {ICategory} from "../../category/api/category";
import {Observable} from "rxjs";
import {Player} from "@games/player";
import {GameStateQueries} from "@games/game-state-queries";
import {ScoreTextComponent} from "./score-text/score-text.component";

@UntilDestroy()
@Component({
  selector: "app-score",
  standalone: true,
  imports: [NgClass, ScoreCircleComponent, ScoreCardsComponent, ScoreTextComponent],
  templateUrl: "./score.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  @Input() isFirstPlayer: boolean = true;
  @Input() category: ICategory;

  public store: Store = inject(Store);
  public currentPlayer$: Observable<Player> = this.store.select(GameStateQueries.currentPlayer$);
  public isPlayer1Turn$: Observable<boolean> = this.store.select(GameStateQueries.isPlayer1Turn$);
}
