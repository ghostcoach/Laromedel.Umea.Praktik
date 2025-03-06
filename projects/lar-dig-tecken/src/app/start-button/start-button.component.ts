import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GameState } from '../game/state/game.state';


@Component({
  selector: 'app-start-button',
  imports: [CommonModule],
  templateUrl: './start-button.component.html',
  styleUrl: './start-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartButtonComponent {
  @Input() onClick: () => void = () => {};
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;
  @Select(GameState.getNumberOfGamesPlayed) numberOfGamesPlayed$!: Observable<number>;

}
