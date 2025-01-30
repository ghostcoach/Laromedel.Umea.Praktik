import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { StartButtonComponent } from '../../start-button/start-button.component'
import { CardComponent } from '../../card/card.component';
import { RoundsComponent } from '../../rounds/rounds.component';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { BildbegreppWords } from '../../category/api/bildbegrepp';

@Component({
  selector: 'app-slumpgenerator-location',
  imports: [CommonModule, StartButtonComponent, CardComponent, RoundsComponent],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SlumpgeneratorLocationComponent implements OnInit{

  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  
  gameStarted = false;
  currentRound = 0;
  maxRounds = 0;
  cardStates: { isFlipped: boolean, isSelected: boolean, isCorrect: boolean }[] = []
  cardStateClasses: string[] = [];

  private shuffledWords: string[] = [];

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnInit():void {
    // this.numberOfOptions$.subscribe(numberOfOptions => {
    //   this.numberOfOptions = numberOfOptions;

    //   this.category$.subscribe(category => {
    //     this.initializeWords(category, numberOfOptions);

    //     this.initializeWords(this.category, this.numberOfOptions);
    //   })
    // })
    // Subscribe to both category$ and numberOfOptions$ at the same time
    combineLatest([this.numberOfOptions$, this.numberOfRounds$, this.category$]).subscribe(
      ([numberOfOptions, numberOfRounds, category]) => {
        this.maxRounds = numberOfRounds;
        this.initializeWords(category, numberOfOptions);
      }
    );
  }

  getNumberArray(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  // Utility function to normalize special characters
  normalizeCharacters(input: string): string {
    return input
      .replace(/ä/g, 'a')
      .replace(/å/g, 'a')
      .replace(/ö/g, 'o');
  }

  shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  shuffleWordsAndFlipBack(): void {
    // Flip all cards back
    this.cardStates.forEach(card => card.isFlipped = false);
    
    setTimeout(() => {
      const wordToDuplicate: string = this.shuffledWords[0];
      this.shuffledWords = this.shuffleArray([...this.shuffledWords, wordToDuplicate]);

      this.initializeWords(this.shuffledWords[0], this.cardStates.length);
      this.cardStates.forEach(card => card.isFlipped = true);
      this.cdRef.detectChanges();
    }, 1500);
  }

  initializeWords(category: string, numberOfOptions: number): void {
    const words: string[] = Object.values(BildbegreppWords);
    
    // Step 1: Select `numberOfOptions` unique words randomly
    const selectedWords: string[] = this.getRandomUniqueWords(words, numberOfOptions);
    // console.log('selectedWords (before duplication):', selectedWords);

    // Step 2: Pick one word to duplicate
    const wordToDuplicate: string = selectedWords[Math.floor(Math.random() * selectedWords.length)];

    // Step 3: Insert the duplicate at index 0
    this.shuffledWords = [wordToDuplicate, ...selectedWords];

    // Step 4: Set all cards as flipped (hidden state)
    this.cardStates = this.shuffledWords.map(() => ({ isFlipped: false, isSelected: false, isCorrect: false }));
    this.cardStateClasses = [];
  }

  startGame(): void {
    this.gameStarted = true;
    this.currentRound = 0;

    setTimeout(() => {
      this.cardStates.forEach(card => card.isFlipped = true);
      this.cdRef.detectChanges();
    }, 500);
  }

  // Helper function to retrieve a specified number of unique random words
  private getRandomUniqueWords(words: string[], numberOfOptions: number): string[] {
    const selectedWords: string[] = [];
    const uniqueWordsSet: Set<string> = new Set<string>();
    
    // Ensure we select exactly 'numberOfOptions - 1' unique words
    while (selectedWords.length < numberOfOptions) {
      const randomWord: string = words[Math.floor(Math.random() * words.length)];
      if (!uniqueWordsSet.has(randomWord)) {
        uniqueWordsSet.add(randomWord);
        selectedWords.push(randomWord);
      }
    }
    
    return selectedWords;

  }

    // Method to determine the card content
    getContent(pairingMode: string, category: string, index: number): string {
      if (!this.shuffledWords.length) {
        this.initializeWords(category, 10); // Default to 10 words if not initialized
      }

    const normalizedWord: string = this.normalizeCharacters(this.shuffledWords[index % this.shuffledWords.length]);
    switch (pairingMode) {
      case 'ord': // WORD mode
        return this.shuffledWords[index % this.shuffledWords.length]; // Cycle through words
      case 'bild': // ILLUSTRATION mode
        return `/assets/subject-area/estetisk-verksamhet/${category}/illustration/${normalizedWord}.svg`; // Assume images are stored with this path
      case 'ritade tecken': // RITADE_TECKEN mode
        return `/assets/subject-area/estetisk-verksamhet/${category}/ritade-tecken/${normalizedWord}.svg`; // Path to drawings
      case 'tecken som stöd': // TAKK mode
        return `/assets/subject-area/estetisk-verksamhet/${category}/video/${normalizedWord}.mp4`; // Path to videos
      default:
        return '';
    }
  }

  getInitialClass(pairingMode: string):string {
    
    switch (pairingMode){
      case 'ord': return 'mode-ord';
      case 'bild': return 'mode-bild';
      case 'ritade tecken': return 'mode-ritade-tecken';
      case 'tecken som stöd': return 'mode-tecken-som-stod';
      default: return 'mode-default'
    }
  }

  getDynamicClass(mode: string, index: number): string {
    return [this.getInitialClass(mode), this.cardStateClasses[index]]
    .filter(cls => !!cls)
    .join(' ');
  }

  updateRoundsComponent(): void {
    this.currentRound++;
    console.log('currentRound in function:', this.currentRound);
    
  }

  // When resetting all cards
  // resetCards() {
  //   this.cardStates.forEach(card => {
  //     card.isFlipped = false;
  //     card.isSelected = false;
  //     card.isCorrect = false;
  //   });

  //   // Clear card state classes
  //   this.cardStateClasses = [];
    
  //   // Manually trigger change detection after state updates
  //   this.cdRef.detectChanges();
  //   console.log('All cards reset.');
  // }

  resetCards() {
    // Reset cards using a new array to trigger change detection
    this.cardStates = this.cardStates.map(card => ({ isFlipped: false, isSelected: false, isCorrect: false }));
    this.cardStateClasses = []; // Clear card state classes
    
    this.cdRef.detectChanges(); // Manually trigger change detection
    console.log('All cards reset.');
  }


  onCardClicked(content: string, index: number): void {
    if(!this.gameStarted) return;

    const selectedWord: string = this.shuffledWords[index];
    const isCorrect = selectedWord === this.shuffledWords[0];


    this.cardStates[index] = {
      isFlipped: true,
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
     console.log(`Card ${index} updated with classes: ${classes}`);

     this.cdRef.detectChanges(); // Manually trigger change detection

    if(isCorrect){
      console.log('Correct! Proceed to next round');
      this.updateRoundsComponent();

      //Disable clicks
      this.gameStarted = false;

      //Reset all cards after short delay
      setTimeout(()=> {
        console.log('Resetting all cards...');
        this.resetCards();
        
        
        //Proceed to next round
        setTimeout(()=> {
          if(this.currentRound < this.maxRounds -1){
            console.log('currentRound:', this.currentRound);
            console.log('maxRounds:', this.maxRounds);
            
            
            // this.currentRound++;
            this.shuffleWordsAndFlipBack();
            this.gameStarted = true;
          } else {
            console.log('You won!');
            this.gameStarted = false;
          }
        }, 500)

      }, 1000)



    } else {
      console.log('Incorrect!');
      
    }

    // if (this.cardStates[index].isCorrect) {
    //   console.log('Correct!');
    // } else {
    //   console.log('Incorrect!');
    // }

  }

  


}