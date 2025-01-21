import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {GameStateQueries} from "@games/game-state-queries";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-score-text",
  standalone: true,
  imports: [AsyncPipe, NgIf, NgClass],
  templateUrl: "./score-text.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreTextComponent implements OnInit {
  @Input() isFirstPlayer: boolean = true;

  public store: Store = inject(Store);
  public isPlayersTurn$: Observable<boolean>;
  public isPlayer1Turn$: Observable<boolean> = this.store.select(GameStateQueries.isPlayer1Turn$);
  public isPlayer2Turn$: Observable<boolean> = this.store.select(GameStateQueries.isPlayer2Turn$);

  public get color(): string {
    return this.isFirstPlayer ? "Oranges" : "Lilas";
  }

  public ngOnInit(): void {
    this.isPlayersTurn$ = this.isFirstPlayer ? this.isPlayer1Turn$ : this.isPlayer2Turn$;
  }
}
