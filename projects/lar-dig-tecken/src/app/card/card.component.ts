import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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

  // Variables to store extracted class names
  modeClass: string = '';
  flippedClass: string = '';
  isCorrectClass: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dynamicClass']) {
      this.extractClasses();
    }
  }

  private extractClasses(): void {
    const classes = this.dynamicClass.split(' '); // Splitting class string into an array
    console.log(classes);
    
    // Assign values based on conditions
    this.modeClass = classes.find(cls => cls.startsWith('mode-')) || '';
    this.isCorrectClass = classes.find(cls => cls.endsWith('-card')) || '';
    this.flippedClass = classes.find(cls => cls.endsWith('flipped')) || '';

    console.log("Status Class:", this.flippedClass);
    console.log("Mode Class:", this.modeClass);
    console.log("Correct Class:", this.isCorrectClass);
  }

  onCardClick(): void {
    this.cardClick.emit(this.content);    
  }
}
