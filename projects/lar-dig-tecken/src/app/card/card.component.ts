import { Component, Input, Output, EventEmitter, ViewChild, QueryList,  ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, ViewChildren, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { CardContentComponent } from './card-content/card-content.component'; //Child component
import { ICardFullStateModel  } from './state/api/card-interface'; //Interface
//States
import { FlippedState } from './state/flipped.state';
import { GameState } from '../game/state/game.state';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardContentComponent, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardComponent implements DoCheck, OnDestroy, OnInit {
  @Input() cardData!: ICardFullStateModel;  // Inputs to determine the content of the card from parent component
  @Output() cardClick = new EventEmitter<string>()  // Output to emit the word when the card is clicked
  // ViewChild and ViewChildren to retrieve data from the child components
  @ViewChild(CardContentComponent) cardContent!: CardContentComponent;
  @ViewChildren('cardElement') cardElement!: QueryList<ElementRef>;
  @ViewChildren(CardContentComponent) cardContentComponent!: QueryList<CardContentComponent>;
  // Selectors to retrieve the current flipped state and game state
  @Select(FlippedState.getFlippedClass) flippedClass$!: Observable<'flipped' | 'not-flipped'>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;
  @Select(GameState.getCurrentRound) currentRound$!: Observable<number>;
  private currentRoundSub!: Subscription;

  mode = '';
  audioPath = '';
  correctClass = '';
  contentMedium = '';
  content = '';
  word = '';
  imgSrc = '';
  category = '';

  videoOrSound: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // Play video only once when the game starts (currentRound === 0), the content is 'tecken-som-stod' and the mode is 'firstCard'
  ngOnInit(): void {
    this.currentRoundSub = this.currentRound$.subscribe((currentRound) => {
      if (currentRound === 0 && this.cardData?.contentMedium === 'tecken-som-stod' && this.cardData?.mode === 'firstCard') {
        this.cardContent.playVideo();
      }
    });
  }

  // DoCheck lifecycle hook to update the card data when the input changes
  ngDoCheck(): void {
    if (this.cardData) {
      this.mode = this.cardData.mode;
      this.audioPath = this.cardData.audioPath;
      this.correctClass = this.cardData.correctClass;
      this.contentMedium = this.cardData.contentMedium;
      this.category = this.cardData.category;
      this.content = this.cardData.content;
      this.word = this.cardData.word;
      this.imgSrc = this.contentMedium === 'tecken-som-stod' ? `assets/layout/icons/play-video-icon.svg` : `assets/layout/icons/play-sound-icon.svg`;
      this.videoOrSound = this.contentMedium === 'tecken-som-stod' ? this.playVideo.bind(this) : this.playAudio.bind(this);
      
      // ✅ Mark component for change detection if necessary
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    if (this.currentRoundSub) {
      this.currentRoundSub.unsubscribe();
    }
  }

  // Function to emit the word when the card is clicked
  onCardClick(): void {
    this.cardClick.emit(this.word);   
  }
  
  // Function to play audio of chosen card
  playAudio(): void {
    if (this.audioPath) {
      const audio: HTMLAudioElement = new Audio(this.audioPath);
      audio.play().catch(error => console.error('Error playing audio:', error));
    }
  }

  // Function to play video of chosen card
  playVideo(): void {
    if (this.cardContent) {
      this.cardContent.playVideo();
    } else {
      console.error("CardContentComponent is not available.");
    }
  }

  // Function to handle keydown event for accessibility
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}
