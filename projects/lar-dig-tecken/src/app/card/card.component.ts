import { Component, Input, Output, EventEmitter} from '@angular/core';
import { CardContentComponent } from './card-content/card-content.component';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-card',
  imports: [CardContentComponent, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() content!: string;
  @Input() pairingMode!: string;
  @Input() category!: string;
  @Input() dynamicClass: string = '';
  @Output() cardClick = new EventEmitter<string>()


  onCardClick(): void {
    this.cardClick.emit(this.content);    
  }
}
