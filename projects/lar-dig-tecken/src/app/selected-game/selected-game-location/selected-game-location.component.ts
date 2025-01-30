import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { UpdateSelectedGame } from '../state/selected-game-state-actions';
import { SelectedGame } from '../api/selected-game';
import { SelectedGameStateQueries } from '../state/selected-game-state-queries';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy
@Component({
  selector: 'app-selected-game-location',
  imports: [CommonModule],
  templateUrl: './selected-game-location.component.html',
  styleUrl: './selected-game-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedGameLocationComponent implements OnInit {
  public selectedGameCapitalized$: Observable<string> = this.store.select(SelectedGameStateQueries.capitalizedSelectedGame$);
  public selectedGameDataName$: Observable<string> = this.store.select(SelectedGameStateQueries.selectedGameDataName$);

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  public ngOnInit():void{
    this.route.paramMap.subscribe((params: ParamMap): void => {
      const selectedGameDataName: string | null = params.get("selected-game") as string;
      if (!selectedGameDataName) return;
      const selectedGame: SelectedGame = selectedGameDataName.replace(/-/g, " ") as SelectedGame;
      this.store.dispatch(new UpdateSelectedGame(selectedGame));
    });
  }
}
