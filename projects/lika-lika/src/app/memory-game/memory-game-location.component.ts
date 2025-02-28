import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Actions, ofActionDispatched, Store} from "@ngxs/store";
import {ICategory} from "../category/api/category";
import {CategoryRepository} from "../category/data/category-repository";
import {NewMemoryGame, RestartMemoryGame} from "@games/memory-game-actions";
import {MemorySettingsStateQueries} from "@games/memory-settings-state-queries";
import {SettingsComponent} from "../settings/settings.component";
import {ScoreComponent} from "./score/score.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {map, Observable, tap} from "rxjs";
import {
  UpdateIsSettingsLocked,
  UpdateNumberOfCards,
  UpdateNumberOfPlayers,
  UpdatePairingModeFirstCard,
  UpdatePairingModeSecondCard,
} from "@games/memory-settings-state-actions";
import {GameStateQueries} from "@games/game-state-queries";
import {GameOverComponent} from "./game-over/game-over.component";
import {ReplayButtonComponent} from "../settings/replay-button/replay-button.component";
import {GoToSettingsComponent} from "../settings/go-to-settings/go-to-settings.component";
import {BreakpointObserver} from "@angular/cdk/layout";
import {UpdateCategoryNamePlaying} from "../subject-area/state/subject-area-state-actions";
import {BoardComponent} from "@games/board.component";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    SettingsComponent,
    ScoreComponent,
    NgIf,
    AsyncPipe,
    GameOverComponent,
    ReplayButtonComponent,
    GoToSettingsComponent,
    BoardComponent,
  ],
  templateUrl: "./memory-game-location.component.html",
  styleUrl: "./memory-game-location.component.scss",
})
export class MemoryGameLocationComponent implements OnInit, AfterViewInit, OnDestroy {
  public category: ICategory;
  public isTwoPlayers$: Observable<boolean> = this.store.select(MemorySettingsStateQueries.isTwoPlayers$);
  public isGameOver$: Observable<boolean> = this.store.select(GameStateQueries.isGameOver$);
  public isDesktopLayout$: Observable<boolean>;

  private readonly tailWindLgBreakPoint: string = "(min-width: 1024px)";

  constructor(
    private route: ActivatedRoute,
    private categoryRepository: CategoryRepository,
    private store: Store,
    private cd: ChangeDetectorRef,
    private actions$: Actions,
    private breakpointObserver: BreakpointObserver,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((params: ParamMap): void => {
      const categoryName: string | null = params.get("category") as string;
      if (!categoryName) return;

      this.category = this.categoryRepository.getCategoryByName(categoryName);
      this.store.dispatch(new UpdateCategoryNamePlaying(this.category.name));
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

    this.isDesktopLayout$ = this.breakpointObserver.observe([this.tailWindLgBreakPoint]).pipe(
      untilDestroyed(this),
      map((result) => result.matches),
    );
  }

  public ngAfterViewInit(): void {
    this.StartNewMemoryGame();
    this.cd.detectChanges();
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new UpdateIsSettingsLocked(false));
  }

  private StartNewMemoryGame(): void {
    this.store.dispatch(
      new NewMemoryGame(
        this.category.cards,
        this.store.selectSnapshot(MemorySettingsStateQueries.numberOfCards$),
        this.store.selectSnapshot(MemorySettingsStateQueries.pairingMode$),
        this.store.selectSnapshot(MemorySettingsStateQueries.isOnePlayer$),
      ),
    );
  }
}
