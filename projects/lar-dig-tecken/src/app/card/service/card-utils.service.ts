import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { ICardFullStateModel, IMultipleFullStateModel } from '../state/api/card-interface';
import { UpdateAllCards } from '../state/card.actions';
import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { CardStateQueries } from '../state/card.queries';

@Injectable({
  providedIn: 'root'
})
export class CardUtilsService {
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(CardStateQueries.audioPath$) audioPath$!: Observable<string[]>;
  @Select(CardStateQueries.flippedClass$) flippedClass$!: Observable<string[]>;
  @Select(CardStateQueries.correctClass$) correctClass$!: Observable<string[]>;
  @Select(CardStateQueries.content$) content$!: Observable<string[]>;
  @Select(CardStateQueries.mode$) mode$!: Observable<boolean[]>;
  @Select(CardStateQueries.cardStates$) cardStates$!: Observable<ICardFullStateModel[]>;
  
  shuffledWords: string[] = [];
  updatedCards: ICardFullStateModel[] = [];
  currentRound = 0;
  maxRounds = 0;
  audioFiles = [
    '/assets/audio/try-again/try-again_1.mp3',
    '/assets/audio/try-again/try-again_2.mp3',
    '/assets/audio/try-again/try-again_3.mp3'
  ];
  audio: HTMLAudioElement | null = null;
  audioIndex = 0; // Keep track of which audio to play next

  constructor(private store: Store) {
     // Subscribe to all variable at the same time
     combineLatest([
      this.numberOfOptions$, 
      this.numberOfRounds$, 
      this.category$
      ])
      .subscribe(([numberOfOptions, numberOfRounds, category]) => {
        this.maxRounds = numberOfRounds;
        this.initializeWords(category, numberOfOptions);
      }
    );
    
   }

   // WORD SHUFFLING FUNCTIONS

   // Function to initialize words from category
      initializeWords(category: string, numberOfOptions: number): void {
         const words: string[] = Object.values(BildbegreppWords);
        
         // Step 1: Select `numberOfOptions` unique words randomly
         const selectedWords: string[] = this.getRandomUniqueWords(words, numberOfOptions);
    
         // Step 2: Pick one word to duplicate
         const wordToDuplicate: string = selectedWords[Math.floor(Math.random() * selectedWords.length)];
    
         // Step 3: Insert the duplicate at index 0
         this.shuffledWords = [wordToDuplicate, ...selectedWords];
  
      }
 
   // Function to shuffle an array
   shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Function to shuffle words and flip back
  shuffleWordsAndFlipBack(category: string, numberOfOptions: number): void {

    //1. Initialize new words
    this.initializeWords(category, numberOfOptions);

      // 2. Flip back all cards
    setTimeout(() => {
      // Create the updated cards with the new flippedClass
      this.updatedCards = this.store.selectSnapshot(CardStateQueries.cardStates$).map(card => ({
        ...card, 
        flippedClass: "not-flipped"  // Update only the flippedClass here
      }));

      // Dispatch action to update all cards
      this.store.dispatch(new UpdateAllCards(this.updatedCards));
    }, 500); // Adjust the delay as needed
      
  }

  // Function to initialize words and set initial card states
  initializeCardStates(category: string, numberOfOptions: number, words: string[]): ICardFullStateModel[] {
     
    // Step 1: Select `numberOfOptions` unique words randomly
     const selectedWords: string[] = this.getRandomUniqueWords(words, numberOfOptions);

    // Step 2: Pick one word to duplicate
    const wordToDuplicate: string = selectedWords[Math.floor(Math.random() * selectedWords.length)];

    // Step 3: Insert the duplicate at index 0
    this.shuffledWords = this.shuffleArray([wordToDuplicate, ...selectedWords]);
    console.log('shuffledWords', this.shuffledWords);
  
      
    return this.shuffledWords.map(word => ({
      mode: '', // example mode
      cardCategory: '',
      content: word, // word or image/video-path
      audioPath: this.getAudioPath(category, word), // optional audio path
      flippedClass: 'flipped', // flipped by default
      correctClass: '', // default class
    }));
  }

  // Helper function to retrieve a specified number of unique random words
 getRandomUniqueWords(words: string[], numberOfOptions: number): string[] {
    numberOfOptions = Math.min(numberOfOptions, words.length);  
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

  //AUDIO FUNCTIONS

  getAudioPath(category: string, word: string): string {
    const normalizedWord: string = this.normalizeCharacters(word);
    return `/assets/subject-area/estetisk-verksamhet/${category}/audio/${normalizedWord}.mp3`;
  }


  playIncorrectAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    
    this.audio = new Audio(this.audioFiles[this.audioIndex]);
    this.audio.play();

    // Move to the next file, looping back to the start
    this.audioIndex = (this.audioIndex + 1) % this.audioFiles.length;
  }



  //HELPER FUNCTIONS
  normalizeCharacters(input: string): string {
    return input
      .replace(/ä/g, 'a')
      .replace(/å/g, 'a')
      .replace(/ö/g, 'o');
  }
}
