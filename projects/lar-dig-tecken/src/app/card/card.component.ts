import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CardContentComponent } from './card-content/card-content.component';

@Component({
  selector: 'app-card',
  imports: [CardContentComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() content!: string;
}
