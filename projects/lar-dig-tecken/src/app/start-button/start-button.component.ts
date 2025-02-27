import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StartButtonStateQueries } from './state/start-button-queries';
import { GameState } from '../game-state/state/game.state';


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

}
