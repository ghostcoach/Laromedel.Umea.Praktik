import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfettiCanonComponent } from 'projects/ui-components/src/public-api';

@Component({
  selector: 'app-game-over',
  imports: [CommonModule, ConfettiCanonComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent{


}