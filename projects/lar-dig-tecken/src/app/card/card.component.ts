import { Component, Input, Output, EventEmitter, ViewChild, QueryList,  ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, ViewChildren, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { CardContentComponent } from './card-content/card-content.component';
import { ICardFullStateModel  } from './state/api/card-interface';
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

  @Output() cardClick = new EventEmitter<string>()
  @ViewChild(CardContentComponent) cardContent!: CardContentComponent;
  @Input() cardData!: ICardFullStateModel;
  @ViewChildren('cardElement') cardElement!: QueryList<ElementRef>;
  @ViewChildren(CardContentComponent) cardContentComponent!: QueryList<CardContentComponent>;
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

  ngOnInit(): void {
    this.currentRoundSub = this.currentRound$.subscribe((currentRound) => {

      // Play video only once when the game starts (currentRound === 0)
      if (currentRound === 0 && this.cardData?.contentMedium === 'tecken-som-stod' && this.cardData?.mode === 'firstCard') {
        this.cardContent.playVideo();
      }
    });
  }

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


  onCardClick(): void {
    this.cardClick.emit(this.word);   
  }
  
  playAudio(): void {
    if (this.audioPath) {
      const audio: HTMLAudioElement = new Audio(this.audioPath);
      audio.play().catch(error => console.error('Error playing audio:', error));
    }
  }

  playVideo(): void {
    if (this.cardContent) {
      this.cardContent.playVideo();
    } else {
      console.error("CardContentComponent is not available.");
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}
