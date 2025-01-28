import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Actions, ofActionDispatched, Store} from "@ngxs/store";
import {ICategory} from "../category/api/category";
import {CategoryRepository} from "../category/data/category-repository";
import {NewMemoryGame, RestartMemoryGame} from "@games/memory-game-actions";
import {SettingsStateQueries} from "../settings/state/settings-state-queries";
import {SettingsComponent} from "../settings/settings.component";
import {BoardComponent} from "./board/board.component";
import {ScoreComponent} from "./score/score.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable, tap} from "rxjs";
import {
  UpdateNumberOfCards,
  UpdateNumberOfPlayers,
  UpdatePairingModeFirstCard,
  UpdatePairingModeSecondCard,
} from "../settings/state/settings-state-actions";
import {GameStateQueries} from "@games/game-state-queries";
import {GameOverComponent} from "./game-over/game-over.component";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [SettingsComponent, BoardComponent, ScoreComponent, NgIf, AsyncPipe, GameOverComponent],
  templateUrl: "./memory-game-location.component.html",
  styleUrl: "./memory-game-location.component.scss",
})
export class MemoryGameLocationComponent implements OnInit, AfterViewInit {
  public category: ICategory;
  public isTwoPlayers$: Observable<boolean> = this.store.select(SettingsStateQueries.isTwoPlayers$);
  public isGameOver$: Observable<boolean> = this.store.select(GameStateQueries.isGameOver$);

  constructor(
    private route: ActivatedRoute,
    private categoryRepository: CategoryRepository,
    private store: Store,
    private cd: ChangeDetectorRef,
    private actions$: Actions,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((params: ParamMap): void => {
      const categoryName: string | null = params.get("category") as string;
      if (!categoryName) return;

      this.category = this.categoryRepository.getCategoryByName(categoryName);
    });

    //If these actions are dispatched, start a new game
    this.actions$
      .pipe(
        untilDestroyed(this),
        ofActionDispatched(
          UpdateNumberOfPlayers,
          UpdateNumberOfCards,
          UpdatePairingModeFirstCard,
          UpdatePairingModeSecondCard,
          RestartMemoryGame,
        ),
        tap((): void => {
          this.StartNewMemoryGame();
        }),
      )
      .subscribe();
  }

  public ngAfterViewInit(): void {
    this.StartNewMemoryGame();
    this.cd.detectChanges();
  }

  private StartNewMemoryGame(): void {
    this.store.dispatch(
      new NewMemoryGame(
        this.category.cards,
        this.store.selectSnapshot(SettingsStateQueries.numberOfCards$),
        this.store.selectSnapshot(SettingsStateQueries.pairingMode$),
        this.store.selectSnapshot(SettingsStateQueries.isOnePlayer$),
      ),
    );
  }
}
