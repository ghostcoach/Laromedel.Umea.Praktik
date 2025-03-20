import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-rounds',
  imports: [],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss'
})
export class RoundsComponent {
@Input() round: number = 0; // The current round from parent component

get imageSrc():string {
  return this.round > 0 ? `/assets/layout/icons/star-filled.svg` : `/assets/layout/icons/star.svg`;
}
}
