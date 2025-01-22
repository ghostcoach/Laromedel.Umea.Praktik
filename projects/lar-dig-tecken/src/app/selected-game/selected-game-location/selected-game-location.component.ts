import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { CapitalizePipe } from "@utility/capitalize.pipe";
import { UpdateSelectedGame } from '../state/selected-game-state-actions';
import { SelectedGame } from '../api/selected-game';
import { SelectedGameStateQueries } from '../state/selected-game-state-queries';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy
@Component({
  selector: 'app-selected-game-location',
  imports: [NgForOf, AsyncPipe, RouterLink, CapitalizePipe, NgClass, CommonModule],
  templateUrl: './selected-game-location.component.html',
  styleUrl: './selected-game-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedGameLocationComponent {
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
      console.log('Dynamic Content Component: ', this.dynamicContent);

    });
  }
}
