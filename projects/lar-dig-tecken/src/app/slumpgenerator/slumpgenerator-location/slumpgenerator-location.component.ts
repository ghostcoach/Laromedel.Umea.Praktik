import { Component, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, distinctUntilChanged } from 'rxjs';
import { StartButtonComponent } from '../../start-button/start-button.component'
import { CardComponent } from '../../card/card.component';
import { RoundsComponent } from '../../rounds/rounds.component';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { GameOverComponent } from '../../game-over/game-over.component';

import { AudioService } from '../../services/audio/audio.service';
import { ShuffleWordsService } from '../../services/shuffle-words/shuffle-words.service';
import { NormalizeCharactersService } from '../../services/normalize-characters/normalize-characters.service';

import { StartButtonStateQueries } from '../../start-button/state/start-button-queries';
import { UpdateStartButtonState } from '../../start-button/state/start-button-actions';

import { SlumpgeneratorService } from '../services/slumpgenerator.service';
import { ICardFullStateModel, IMultipleFullStateModel } from '../../card/state/api/card-interface';
import { CardStates } from '../../card/state/card.state';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-slumpgenerator-location',
  imports: [CommonModule, StartButtonComponent, CardComponent, RoundsComponent, GameOverComponent],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SlumpgeneratorLocationComponent implements OnInit{

  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(StartButtonStateQueries.startBtnActive$) startBtnActive$!: Observable<boolean>;
  @Select(CardStates.getCardStates) cardStates$!: Observable<ICardFullStateModel[]>;


  // cardStates: { isFlipped: boolean, isSelected: boolean, isCorrect: boolean }[] = []
  // cardStateClasses: string[] = [];
  
  // gameStarted = false;
  // currentRound = 0;
  // maxRounds = 0;
  // gameOver = false;

  firstCardState: ICardFullStateModel[] = [];
  secondCardState: ICardFullStateModel[] = [];

  //Get all card statesand divide into to arrays, firstCardStates and secondCardStates
  constructor(
    private cdRef: ChangeDetectorRef, 
    private ngZone: NgZone, 
    public audioService: AudioService, 
    public shuffleWordsService: ShuffleWordsService,
    private normalizeCharactersService: NormalizeCharactersService,
    public slumpgeneratorService: SlumpgeneratorService,
    private store: Store  
  ) {}

  ngOnInit():void {
    
    
    this.cardStates$.pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      map(cards => {

        const newFirstCardState = cards.filter(card => card.mode === 'firstCard');
        const newSecondCardState = cards.filter(card => card.mode === 'secondCard');
    
        // Only update if the new state is different
        if (JSON.stringify(newFirstCardState) !== JSON.stringify(this.firstCardState)) {
          this.firstCardState = [...newFirstCardState];
        }
    
        if (JSON.stringify(newSecondCardState) !== JSON.stringify(this.secondCardState)) {
          this.secondCardState = [...newSecondCardState];
        }
    
        this.cdRef.markForCheck();
   
      })
      
    ).subscribe(); // Don't forget to subscribe!
    
    // Subscribe to both category$ and numberOfOptions$ at the same time
    // combineLatest([
    //   this.numberOfOptions$, 
    //   this.numberOfRounds$, 
    //   this.category$,
    // ])
    //   .subscribe(([
    //     numberOfOptions, 
    //     numberOfRounds, 
    //     category, 
    //   ]) => {
    //     this.maxRounds = numberOfRounds;
    //     this.shuffleWordsService.initializeWords(category, numberOfOptions);
    //   }
    // );

    // this.shuffleWordsService.cardStates$.subscribe(states => {
    //   this.ngZone.run(() => { // Ensures Angular detects changes
    //     this.cardStates = states;
    //     this.cdRef.detectChanges(); // Manually trigger change detection
    //   });
    // });

    // this.shuffleWordsService.cardStateClasses$.subscribe(states => {
    //   this.ngZone.run(() => { // Ensures Angular detects changes
    //     this.cardStateClasses = states;
    //     this.cdRef.detectChanges(); // Manually trigger change detection
    //   });
    // });

    // Restart game if category or pairing mode changes
    // combineLatest([
    //   this.category$, 
    //   this.pairingModeFirst$, 
    //   this.pairingModeSecond$,
    //   this.numberOfOptions$,
    //   this.numberOfRounds$,
    // ]).subscribe(() => {
    //     if (this.gameStarted) {
    //       // this.restartGame();
    //       // this.startGame();
    //     }
    //   });
      
  }

  // HELPER FUNCTIONS

  // Function to get an array of numbers from 1 to count
  getNumberArray(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  // GAME LOGIC

  // Function to start the game
  // startGame(): void {
  //   this.gameStarted = true;
  //   this.currentRound = 0;
  //   this.store.dispatch(new UpdateStartButtonState(false));
  //   this.gameOver = false;

  //   setTimeout(() => {
  //     this.cardStates = this.cardStates.map(card => ({...card, isFlipped: false}));
  //     this.cdRef.detectChanges();
  //   }, 500);
    
  // }

  // restartGame(): void {
  //   combineLatest([this.category$, this.numberOfOptions$]).subscribe(
  //     ([category, numberOfOptions]) => {
  //       this.shuffleWordsService.initializeWords(category, numberOfOptions);
  //       this.gameStarted = false; // Re-enable clicks
  //       this.store.dispatch(new UpdateStartButtonState(true));
  //     }
  //   );
  // }

  // Method to determine the card content
  // getContent(pairingMode: string, category: string, index: number): string {
  //   if (!this.shuffleWordsService.shuffledWords.length) {
  //     this.shuffleWordsService.initializeWords(category, 10); // Default to 10 words if not initialized
  //   }

  //   const normalizedWord: string = this.normalizeCharactersService.normalizeCharacters(this.shuffleWordsService.shuffledWords[index % this.shuffleWordsService.shuffledWords.length]);
  //   switch (pairingMode) {
  //     case 'ord': // WORD mode
  //       return this.shuffleWordsService.shuffledWords[index % this.shuffleWordsService.shuffledWords.length]; // Cycle through words
  //     case 'bild': // ILLUSTRATION mode
  //       return `/assets/subject-area/estetisk-verksamhet/${category}/illustration/${normalizedWord}.png`; // Assume images are stored with this path
  //     case 'ritade tecken': // RITADE_TECKEN mode
  //       return `/assets/subject-area/estetisk-verksamhet/${category}/ritade-tecken/${normalizedWord}.svg`; // Path to drawings
  //     case 'tecken som stöd': // TAKK mode
  //       return `/assets/subject-area/estetisk-verksamhet/${category}/video/${normalizedWord}.mp4`; // Path to videos
  //     default:
  //       return '';
  //   }
  // }


  //CLASS LOGIC

  // Method to determine the initial class
  // getInitialClass(pairingMode: string):string {
    
  //   switch (pairingMode){
  //     case 'ord': return 'mode-ord';
  //     case 'bild': return 'mode-bild';
  //     case 'ritade tecken': return 'mode-ritade-tecken';
  //     case 'tecken som stöd': return 'mode-tecken-som-stod';
  //     default: return 'mode-default'
  //   }
  // }

  // Method to determine the dynamic class
  // getDynamicClass(mode: string, index: number): string {
  //   const flipClass: string = this.cardStates[index].isFlipped ? 'flipped' : 'not-flipped';
  
  //   // const dynamicClasses = [this.getInitialClass(mode), flipClass, this.cardStateClasses[index]]
  //   // .filter(cls => !!cls)
  //   // .join(' ');

  //   // console.log('dynamicClasses:', dynamicClasses);
  //   return [this.getInitialClass(mode), flipClass, this.cardStateClasses[index]]
  //   .filter(cls => !!cls)
  //   .join(' ');

  // }


  // Method to handle card clicks
  // onCardClicked(content: string, index: number): void {
  //   if(!this.gameStarted) return;
    
  //   const selectedWord: string = this.shuffleWordsService.shuffledWords[index];
  //   console.log('selectedWord:', selectedWord);
    
  //   const isCorrect: boolean = selectedWord === this.shuffleWordsService.shuffledWords[0];
  //   this.cardStates[index] = {
  //     isFlipped: false, 
  //     isSelected: true,
  //     isCorrect: isCorrect
  //   }
  //   this.cdRef.detectChanges(); // Manually trigger change detection
  //   console.log('this.cardStates', this.cardStates);
    
  //    // Calculate the classes dynamically
  //   const classes: string = [
  //     isCorrect ? 'correct-card' : '',
  //     (!isCorrect && this.cardStates[index].isSelected) ? 'incorrect-card' : ''
  //   ].filter(Boolean).join(' ');  // Join non-empty strings into a single class string

  //   // Save the class object for the clicked card
  //   this.cardStateClasses[index] = classes;  
    
  //   this.cdRef.detectChanges(); // Manually trigger change detection

  //   if(isCorrect){
  //     this.currentRound++;
  //     //Disable clicks
  //     this.gameStarted = false;
  //     //Reset all cards after short delay
  //     setTimeout(()=> {
  //       this.cardStates = this.cardStates.map(card => ({
  //         ...card,
  //         isFlipped: true,
  //       }));
  //       console.log('this.cardStates', this.cardStates);
        
        
  //       this.cdRef.detectChanges(); // Manually trigger change detection
        
  //       //Proceed to next round
  //       setTimeout(()=> {
  //         if(this.currentRound < this.maxRounds){
          
  //           combineLatest([this.category$, this.numberOfOptions$]).subscribe(
  //             ([category, numberOfOptions]) => {
  //               this.shuffleWordsService.shuffleWordsAndFlipBack(category, numberOfOptions);
  //               this.cdRef.detectChanges();
  //               this.gameStarted = true; // Re-enable clicks
  //             }
  //           );

  //         } else {
  //           this.restartGame();
  //           this.gameOver = true;
  //           this.cdRef.detectChanges();
            
  //            // Keep gameOver true for 2 seconds, then reset it
  //           setTimeout(() => {
  //             this.gameOver = false;
  //             this.cdRef.detectChanges();
  //           }, 7900);

  //           this.gameStarted = false;
  //         }
  //       }, 500)

  //     }, 1000)

  //   } else {
  //     this.audioService.playIncorrectAudio();
  //   }

  // }

}