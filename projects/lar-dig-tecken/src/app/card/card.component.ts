import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, ViewChild, QueryList } from '@angular/core';
import { CardContentComponent } from './card-content/card-content.component';
import { CommonModule } from "@angular/common";
import { Select } from '@ngxs/store';
import { GameSettingsStateQueries } from '../settings/state/game-settings-queries';
import { Observable, combineLatest } from 'rxjs';
import { ViewChildren, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [CardContentComponent, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnChanges, OnInit {
  @Input() content!: string;
  @Input() pairingMode!: string;
  @Input() category!: string;
  @Input() dynamicClass: string = '';
  @Input() audioPath: string = '';
  @Output() cardClick = new EventEmitter<string>()
  @ViewChild(CardContentComponent) cardContent!: CardContentComponent;
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Input() mode!: string;
  @Input() gameStarted!: boolean;
  @ViewChildren('cardElement') cardElement!: QueryList<ElementRef>;

    
  ngOnInit():void {
      // console.log('mode:', this.mode);
      // console.log('content:', this.content);
      // console.log('audioPath:', this.audioPath);
      // console.log('dynamicClass:', this.dynamicClass);

    }

  // Variables to store extracted class names
  modeClass: string = '';
  flippedClass: string = '';
  isCorrectClass: string = '';

  //Variables for image or video-format
  imgSrc: string = this.pairingMode === 'tecken som stöd' ? `assets/layout/icons/play-video-icon.svg` : `assets/layout/icons/play-sound-icon.svg`;
  videoOrSound: () => void = this.pairingMode === 'tecken som stöd' 
  ? this.playVideo.bind(this) 
  : this.playAudio.bind(this);
  videoSrc: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dynamicClass']) {
      this.extractClasses();
    }
    if (changes['pairingMode']) {
      this.imgSrc = this.pairingMode === 'tecken som stöd' ? `assets/layout/icons/play-video-icon.svg` : `assets/layout/icons/play-sound-icon.svg`;
      this.videoOrSound = this.pairingMode === 'tecken som stöd'
        ? this.playVideo.bind(this)
        : this.playAudio.bind(this);
    }
    console.log('mode:', this.mode);
    console.log('content:', this.content);
    console.log('audioPath:', this.audioPath);
    console.log('dynamicClass:', this.dynamicClass);
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
    // console.log('audioPath', this.audioPath);
    
  }
  
  playAudio(): void {
    const audio: HTMLAudioElement = new Audio(this.audioPath);
    audio.play().catch(error => console.error('Error playing audio:', error));
  }

  playVideo(): void {
    if (this.cardContent) {
      this.cardContent.playVideo();
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}
