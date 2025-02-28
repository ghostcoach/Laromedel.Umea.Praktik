import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {GameStateQueries} from "@games/game-state-queries";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ICategory} from "../../../category/api/category";
import {MemorySettingsStateQueries} from "@games/memory-settings-state-queries";

@UntilDestroy()
@Component({
  selector: "app-score-cards",
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, NgClass],
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
  public numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);

  public ngOnInit(): void {
    this.playerScore$ = this.isFirstPlayer ? this.playerOneScore$ : this.playerTwoScore$;
  }

  protected getScoreImageStyling(numberOfCards: number | null): string {
    if (numberOfCards === undefined) {
      return "";
    }

    switch (numberOfCards) {
      case 10:
        return "w-4/5";

      case 12:
        return "w-4/5 narrow:w-3/5";

      case 14:
        return "w-3/5 narrow:w-[55%]";

      case 16:
        return "w-3/5 narrow:w-1/2";

      default:
        return "w-full";
    }
  }
}
