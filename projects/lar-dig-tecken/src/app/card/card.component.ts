import { Component, Input, Output, EventEmitter, ViewChild, QueryList,  ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { CardContentComponent } from './card-content/card-content.component';
// import { GameSettingsStateQueries } from '../settings/state/game-settings-queries';
import { ICardFullStateModel  } from './state/api/card-interface';
import { FlippedState } from './state/flipped.state';
import { GameState } from '../game-state/state/game.state';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardContentComponent, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements DoCheck {

  @Output() cardClick = new EventEmitter<string>()
  @ViewChild(CardContentComponent) cardContent!: CardContentComponent;
  // @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;

  @Input() cardData!: ICardFullStateModel;
  @ViewChildren('cardElement') cardElement!: QueryList<ElementRef>;
  @ViewChildren(CardContentComponent) cardContentComponent!: QueryList<CardContentComponent>;
  @Select(FlippedState.getFlippedClass) flippedClass$!: Observable<'flipped' | 'not-flipped'>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;

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
