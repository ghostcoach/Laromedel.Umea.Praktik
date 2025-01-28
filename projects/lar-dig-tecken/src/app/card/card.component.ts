import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardContentComponent } from './card-content/card-content.component';
// import { ICard } from '../slumpgenerator/api/card'

@Component({
  selector: 'app-card',
  imports: [CardContentComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() content!: string;
  @Output() cardClick = new EventEmitter<string>()

  onCardClick(): void {
    this.cardClick.emit(this.content);
    
  }
}
