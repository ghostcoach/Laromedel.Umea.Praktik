import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {GameStateQueries} from "@games/game-state-queries";
import {AsyncPipe} from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-score",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./score.component.html",
  styleUrl: "./score.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  public store: Store = inject(Store);
  public playerOneScore$: Observable<number> = this.store.select(GameStateQueries.player1Score$);
}
