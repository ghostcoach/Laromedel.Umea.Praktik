import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CardContentComponent } from './card-content/card-content.component';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-card',
  imports: [CardContentComponent, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnChanges {
  @Input() content!: string;
  @Input() pairingMode!: string;
  @Input() category!: string;
  @Input() dynamicClass: string = '';
  @Input() audioPath: string = '';
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

constructor() {
    console.log('audioPath', this.audioPath);
    
  }

  private extractClasses(): void {
    const classes: string[] = this.dynamicClass.split(' '); // Splitting class string into an array
    
    // Assign values based on conditions
    this.modeClass = classes.find(cls => cls.startsWith('mode-')) || '';
    this.isCorrectClass = classes.find(cls => cls.endsWith('-card')) || '';
    this.flippedClass = classes.find(cls => cls.endsWith('flipped')) || '';
  }

  onCardClick(): void {
    this.cardClick.emit(this.content);   
  }
  
  playAudio(): void {
    const audio: HTMLAudioElement = new Audio(this.audioPath);
    audio.play().catch(error => console.error('Error playing audio:', error));
  }
}
