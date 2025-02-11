import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfettiCanonComponent } from 'projects/ui-components/src/public-api';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-game-over',
  imports: [CommonModule, ConfettiCanonComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('2s ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class GameOverComponent{
  @Input() gameOver!: boolean; // Bind directly to parent’s gameOver variable

}