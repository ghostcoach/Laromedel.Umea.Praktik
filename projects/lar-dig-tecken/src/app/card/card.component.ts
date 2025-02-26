import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, ViewChild, QueryList,  ChangeDetectorRef, ChangeDetectionStrategy, DoCheck } from '@angular/core';
import { CardContentComponent } from './card-content/card-content.component';
import { CommonModule } from "@angular/common";
import { Select } from '@ngxs/store';
import { GameSettingsStateQueries } from '../settings/state/game-settings-queries';
import { Observable, combineLatest } from 'rxjs';
import { ViewChildren, ElementRef } from '@angular/core';
import { CardStates } from './state/card.state';
import { ICardFullStateModel, IMultipleFullStateModel  } from './state/api/card-interface';
import { map } from 'rxjs/operators';
import { FlippedState } from './state/flipped.state';

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
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;

  @Input() gameStarted!: boolean;
  @Input() cardData!: ICardFullStateModel;
  @ViewChildren('cardElement') cardElement!: QueryList<ElementRef>;
  @ViewChildren(CardContentComponent) cardContentComponent!: QueryList<CardContentComponent>;
  @Select(FlippedState.getFlippedClass) flippedClass$!: Observable<'flipped' | 'not-flipped'>;

  mode = '';
  audioPath = '';
  // flippedClass = '';
  correctClass = '';
  contentMedium = '';
  content = '';
  word = '';
  imgSrc = '';
  videoOrSound: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {
    console.log('flippedClass$', this.flippedClass$);
    
  }

  ngDoCheck(): void {
    
    
    if (this.cardData) {
      this.mode = this.cardData.mode;
      this.audioPath = this.cardData.audioPath;
      // this.flippedClass = this.cardData.flippedClass;
      this.correctClass = this.cardData.correctClass;
      this.contentMedium = this.cardData.contentMedium;
      this.content = this.cardData.content;
      this.word = this.cardData.word;
      this.imgSrc = this.contentMedium === 'tecken-som-stod' ? `assets/layout/icons/play-video-icon.svg` : `assets/layout/icons/play-sound-icon.svg`;
      this.videoOrSound = this.contentMedium === 'tecken-som-stod' ? this.playVideo.bind(this) : this.playAudio.bind(this);
      // ✅ Mark component for change detection if necessary
      this.cdr.markForCheck();
    }
  }

  
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['cardData'] && this.cardData) {
  //     this.mode = this.cardData.mode;
  //     this.audioPath = this.cardData.audioPath;
  //     this.flippedClass = this.cardData.flippedClass;
  //     this.correctClass = this.cardData.correctClass;
  //     this.contentMedium = this.cardData.contentMedium;
  //     this.content = this.cardData.content;
  //   }
  // }



  onCardClick(): void {
    this.cardClick.emit(this.word);   
    // console.log('audioPath', this.audioPath);
    
  }
  
  playAudio(): void {
    if (this.audioPath) {
      const audio = new Audio(this.audioPath);
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

  // playVideo(videoSrc: string): void {
  //   if (this.content) {
  //     this.content.playVideo();
  //   }
  // }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}
