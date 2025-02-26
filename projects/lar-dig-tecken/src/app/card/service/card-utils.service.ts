import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { ICardFullStateModel, IMultipleFullStateModel } from '../state/api/card-interface';
import { UpdateAllCards } from '../state/card.actions';
import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { CardStateQueries } from '../state/card.queries';
import { debounceTime } from 'rxjs/operators';
import { GameSettingsState } from '../../settings/state/game-settings-state';

@Injectable({
  providedIn: 'root'
})
export class CardUtilsService {
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
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
    combineLatest([
      this.numberOfOptions$, 
      this.numberOfRounds$, 
      this.category$
    ])
    .pipe(debounceTime(100)) // ✅ Prevents rapid multiple updates
    .subscribe(([numberOfOptions, numberOfRounds, category]) => {
      this.maxRounds = numberOfRounds;
      this.initializeWords(category, numberOfOptions);
    });
   }

  // WORD SHUFFLING FUNCTIONS

  // Function to initialize ALL WORDS from category
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

    // //1. Initialize new words
    // this.initializeWords(category, numberOfOptions);

    // // 2. First update: Set the new words
    // const currentCards = this.store.selectSnapshot(CardStateQueries.cardStates$);
    // const updatedCardsWithWords = currentCards.map((card, index) => ({
    //   ...card,
    //   content: words[index] || card.content, // Update content safely
    // }));

    // this.store.dispatch(new UpdateAllCards(updatedCardsWithWords));
    
    // // 3. Second update: Set flippedClass to "not-flipped" after a delay
    // setTimeout(() => {
    //   const updatedCardsWithFlippedClass = this.store
    //     .selectSnapshot(CardStateQueries.cardStates$)
    //     .map(card => ({
    //       ...card,
    //       flippedClass: "not-flipped",
    //     }));

    //   this.store.dispatch(new UpdateAllCards(updatedCardsWithFlippedClass));
    // }, 500); // Adjust delay as needed
      
  }

  // Function to initialize words and set initial card states
  initializeCardStates(
    category: string, 
    numberOfOptions: number, 
    words: string[], 
    pairingModeFirst: string, 
    pairingModeSecond: string
  ): ICardFullStateModel[] {
     
    // Step 1: Select `numberOfOptions` unique words randomly
    const selectedWords: string[] = this.getRandomUniqueWords(words, numberOfOptions);

    // Step 2: Pick one word to duplicate
    const wordToDuplicate: string = selectedWords[Math.floor(Math.random() * selectedWords.length)];

    // Step 3: Shuffle the selected words
    const shuffledSelectedWords = this.shuffleArray(selectedWords);

    // Step 4: Insert the duplicate at index 0
    this.shuffledWords = [wordToDuplicate, ...shuffledSelectedWords];

    
      
    return this.shuffledWords.map((word, index) => ({
      mode: index === 0 ? 'firstCard' : 'secondCard', // example mode
      contentMedium: index === 0 ? this.formatString(pairingModeFirst) : this.formatString(pairingModeSecond), // example category
      word: word, // word or image/video-path
      content: index === 0 ? this.getMediaPath(category, this.formatString(pairingModeFirst), word) : this.getMediaPath(category, this.formatString(pairingModeSecond), word),
      audioPath: this.getAudioPath(category, word), // audio path
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

  getMediaPath(category: string, contentMedium: string, word: string): string {
    
    const normalizedWord: string = this.normalizeCharacters(word);
    if (contentMedium === 'ord') {
      return word;
    } else if (contentMedium === 'bild') {
      return `/assets/subject-area/estetisk-verksamhet/${category}/illustration/${normalizedWord}.webp`;
    } else if (contentMedium === 'ritade-tecken') {
      return `/assets/subject-area/estetisk-verksamhet/${category}/ritade-tecken/${normalizedWord}.webp`;
    } else if (contentMedium === 'tecken-som-stod') {
      return `/assets/subject-area/estetisk-verksamhet/${category}/video/${normalizedWord}.mp4`;
    } else {
      return '';
    }
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

  formatString(input: string):string {
    return input
      .toLowerCase()        // Convert to lowercase
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/å/g, 'a')   // Replace Swedish characters
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o');
  }

}
