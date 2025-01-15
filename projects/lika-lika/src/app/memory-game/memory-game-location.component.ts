import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Store} from "@ngxs/store";
import {ICategory} from "../category/api/category";
import {CategoryRepository} from "../category/data/category-repository";
import {NewMemoryGame} from "@games/memory-game-actions";
import {SettingsStateQueries} from "../settings/state/settings-state-queries";
import {SettingsComponent} from "../settings/settings.component";
import {BoardComponent} from "./board/board.component";
import {ScoreComponent} from "./score/score.component";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [SettingsComponent, BoardComponent, ScoreComponent],
  templateUrl: "./memory-game-location.component.html",
  styleUrl: "./memory-game-location.component.scss",
})
export class MemoryGameLocationComponent implements OnInit, AfterViewInit {
  public category: ICategory;

  constructor(
    private route: ActivatedRoute,
    private categoryRepository: CategoryRepository,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((params: ParamMap): void => {
      const categoryName: string | null = params.get("category") as string;
      if (!categoryName) return;

      this.category = this.categoryRepository.getCategoryByName(categoryName);
    });
  }

  public ngAfterViewInit(): void {
    this.store.dispatch(
      new NewMemoryGame(
        this.category.cards,
        this.store.selectSnapshot(SettingsStateQueries.numberOfCards$),
        this.store.selectSnapshot(SettingsStateQueries.pairingMode$),
      ),
    );
    this.cd.detectChanges();
  }
}
