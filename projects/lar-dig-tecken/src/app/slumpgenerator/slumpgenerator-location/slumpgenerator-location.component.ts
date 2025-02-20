import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { StartButtonComponent } from '../../start-button/start-button.component'
import { CardComponent } from '../../card/card.component';
import { RoundsComponent } from '../../rounds/rounds.component';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { GameOverComponent } from '../../game-over/game-over.component';
import { ViewChildren, ElementRef, QueryList } from '@angular/core';

import { AudioService } from '../../services/audio/audio.service';
import { ShuffleWordsService } from '../../services/shuffle-words/shuffle-words.service';
import { NormalizeCharactersService } from '../../services/normalize-characters/normalize-characters.service';

@Component({
  selector: 'app-slumpgenerator-location',
  imports: [CommonModule, StartButtonComponent, CardComponent, RoundsComponent, GameOverComponent],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
})

export class SlumpgeneratorLocationComponent implements OnInit{

  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>

  gameStarted = false;
  currentRound = 0;
  maxRounds = 0;
  cardStates: { isFlipped: boolean, isSelected: boolean, isCorrect: boolean }[] = []
  cardStateClasses: string[] = [];
  startBtnActive = true;
  gameOver = false;

  private shuffledWords: string[] = [];

  constructor(
    private cdRef: ChangeDetectorRef, 
    private ngZone: NgZone, 
    public audioService: AudioService, 
    public shuffleWordsService: ShuffleWordsService,
    private normalizeCharactersService: NormalizeCharactersService
  ) { }

  ngOnInit():void {
    // Subscribe to both category$ and numberOfOptions$ at the same time
    combineLatest([
      this.numberOfOptions$, 
      this.numberOfRounds$, 
      this.category$])
      .subscribe(([numberOfOptions, numberOfRounds, category]) => {
        this.maxRounds = numberOfRounds;
        this.shuffleWordsService.initializeWords(category, numberOfOptions);
      }
    );

    this.shuffleWordsService.cardStates$.subscribe(states => {
      this.ngZone.run(() => { // Ensures Angular detects changes
        this.cardStates = states;
        this.cdRef.detectChanges(); // Manually trigger change detection
      });
    });

    this.shuffleWordsService.cardStateClasses$.subscribe(states => {
      this.ngZone.run(() => { // Ensures Angular detects changes
        this.cardStateClasses = states;
        this.cdRef.detectChanges(); // Manually trigger change detection
      });
    });

    // Restart game if category or pairing mode changes
  combineLatest([
    this.category$, 
    this.pairingModeFirst$, 
    this.pairingModeSecond$,
    this.numberOfOptions$,
    this.numberOfRounds$,
  ]).subscribe(([category, pairingModeFirst, pairingModeSecond, numberOfOptions, numberOfRounds]) => {
    if (this.gameStarted) {
      this.restartGame();
      this.startGame();
    }
  });
  }

  // HELPER FUNCTIONS

  // Function to get an array of numbers from 1 to count
  getNumberArray(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  // WORD SHUFFLING FUNCTIONS

  // Function to shuffle an array
  // shuffleArray<T>(array: T[]): T[] {
  //   return array
  //     .map(value => ({ value, sort: Math.random() }))
  //     .sort((a, b) => a.sort - b.sort)
  //     .map(({ value }) => value);
  // }

  // Function to shuffle words and flip back
  // shuffleWordsAndFlipBack(category: string, numberOfOptions: number): void {

  //     //MÅSTE LÄGGA TILL SÅ ATT INTE SAMMA ORD KOMMER IGEN
  //     this.initializeWords(category, numberOfOptions);

  //     setTimeout(() => {
  //       this.cardStates = this.cardStates.map(card => ({ ...card, isFlipped: false }));
  //       this.cdRef.detectChanges(); // Manually trigger change detection
  //     }, 500); // Adjust the delay as needed
  // }

  // Function to initialize words from category
  // initializeWords(category: string, numberOfOptions: number): void {
  //   const words: string[] = Object.values(BildbegreppWords);
    
  //   // Step 1: Select `numberOfOptions` unique words randomly
  //   const selectedWords: string[] = this.getRandomUniqueWords(words, numberOfOptions);
  //   // console.log('selectedWords (before duplication):', selectedWords);

  //   // Step 2: Pick one word to duplicate
  //   const wordToDuplicate: string = selectedWords[Math.floor(Math.random() * selectedWords.length)];

  //   // Step 3: Insert the duplicate at index 0
  //   this.shuffleWordsService.shuffledWords = [wordToDuplicate, ...selectedWords];

  //   // Step 4: Set all cards as flipped (hidden state)
  //   this.shuffleWordsService.cardStates = this.shuffleWordsService.shuffledWords.map(() => ({ isFlipped: true, isSelected: false, isCorrect: false }));
  //   this.shuffleWordsService.cardStateClasses = [];
  // }

  // Helper function to retrieve a specified number of unique random words
  // private getRandomUniqueWords(words: string[], numberOfOptions: number): string[] {
  //   const selectedWords: string[] = [];
  //   const uniqueWordsSet: Set<string> = new Set<string>();
    
  //   // Ensure we select exactly 'numberOfOptions - 1' unique words
  //   while (selectedWords.length < numberOfOptions) {
  //     const randomWord: string = words[Math.floor(Math.random() * words.length)];
  //     if (!uniqueWordsSet.has(randomWord)) {
  //       uniqueWordsSet.add(randomWord);
  //       selectedWords.push(randomWord);
  //     }
  //   }
    
  //   return selectedWords;
  // }


  // GAME LOGIC

  // Function to start the game
  startGame(): void {
    this.gameStarted = true;
    this.currentRound = 0;
    this.startBtnActive = false;
    this.gameOver = false;

    setTimeout(() => {
      this.cardStates = this.cardStates.map(card => ({...card, isFlipped: false}));
      this.cdRef.detectChanges();
    }, 500);
    
  }

  restartGame(): void {
    combineLatest([this.category$, this.numberOfOptions$]).subscribe(
      ([category, numberOfOptions]) => {
        this.shuffleWordsService.initializeWords(category, numberOfOptions);
        this.gameStarted = false; // Re-enable clicks
        this.startBtnActive = true;
      }
    );
  }

  // Method to determine the card content
  getContent(pairingMode: string, category: string, index: number): string {
    if (!this.shuffleWordsService.shuffledWords.length) {
      this.shuffleWordsService.initializeWords(category, 10); // Default to 10 words if not initialized
    }

    const normalizedWord: string = this.normalizeCharactersService.normalizeCharacters(this.shuffleWordsService.shuffledWords[index % this.shuffleWordsService.shuffledWords.length]);
    switch (pairingMode) {
      case 'ord': // WORD mode
        return this.shuffleWordsService.shuffledWords[index % this.shuffleWordsService.shuffledWords.length]; // Cycle through words
      case 'bild': // ILLUSTRATION mode
        return `/assets/subject-area/estetisk-verksamhet/${category}/illustration/${normalizedWord}.png`; // Assume images are stored with this path
      case 'ritade tecken': // RITADE_TECKEN mode
        return `/assets/subject-area/estetisk-verksamhet/${category}/ritade-tecken/${normalizedWord}.svg`; // Path to drawings
      case 'tecken som stöd': // TAKK mode
        return `/assets/subject-area/estetisk-verksamhet/${category}/video/${normalizedWord}.mp4`; // Path to videos
      default:
        return '';
    }
  }


  //CLASS LOGIC

  // Method to determine the initial class
  getInitialClass(pairingMode: string):string {
    
    switch (pairingMode){
      case 'ord': return 'mode-ord';
      case 'bild': return 'mode-bild';
      case 'ritade tecken': return 'mode-ritade-tecken';
      case 'tecken som stöd': return 'mode-tecken-som-stod';
      default: return 'mode-default'
    }
  }

  // Method to determine the dynamic class
  getDynamicClass(mode: string, index: number): string {
    const flipClass: string = this.cardStates[index].isFlipped ? 'flipped' : 'not-flipped';
  
    return [this.getInitialClass(mode), flipClass, this.cardStateClasses[index]]
    .filter(cls => !!cls)
    .join(' ');

  }


  // Method to handle card clicks
  onCardClicked(content: string, index: number): void {
    if(!this.gameStarted) return;
    
    const selectedWord: string = this.shuffleWordsService.shuffledWords[index];
    
    const isCorrect: boolean = selectedWord === this.shuffleWordsService.shuffledWords[0];
    this.cardStates[index] = {
      isFlipped: false, 
      isSelected: true,
      isCorrect: isCorrect
    }
    this.cdRef.detectChanges(); // Manually trigger change detection

     // Calculate the classes dynamically
    const classes: string = [
      isCorrect ? 'correct-card' : '',
      (!isCorrect && this.cardStates[index].isSelected) ? 'incorrect-card' : ''
    ].filter(Boolean).join(' ');  // Join non-empty strings into a single class string

    // Save the class object for the clicked card
    this.cardStateClasses[index] = classes;  
    this.cdRef.detectChanges(); // Manually trigger change detection

    if(isCorrect){
      this.currentRound++;
      //Disable clicks
      this.gameStarted = false;
      //Reset all cards after short delay
      setTimeout(()=> {
        this.cardStates = this.cardStates.map(card => ({
          ...card,
          isFlipped: true,
        }));
        
        this.cdRef.detectChanges(); // Manually trigger change detection
        
        //Proceed to next round
        setTimeout(()=> {
          if(this.currentRound < this.maxRounds){
          
            combineLatest([this.category$, this.numberOfOptions$]).subscribe(
              ([category, numberOfOptions]) => {
                this.shuffleWordsService.shuffleWordsAndFlipBack(category, numberOfOptions);
                this.cdRef.detectChanges();
                this.gameStarted = true; // Re-enable clicks
              }
            );

          } else {
            this.restartGame();
            this.gameOver = true;
            this.cdRef.detectChanges();
            
             // Keep gameOver true for 2 seconds, then reset it
            setTimeout(() => {
              this.gameOver = false;
              this.cdRef.detectChanges();
            }, 7900);
          }
        }, 500)

      }, 1000)

    } else {
      this.audioService.playIncorrectAudio();
    }

  }

}