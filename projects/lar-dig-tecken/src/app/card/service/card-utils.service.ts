import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GameSettingsState } from '../../settings/state/game-settings-state';
import { ICardFullStateModel } from '../state/api/card-interface';
import { CardStateQueries } from '../state/card.queries';

@Injectable({
  providedIn: 'root'
})
export class CardUtilsService {
  // @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  // @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  // @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  // @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  // @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(GameSettingsState.getNumberOfOptions) numberOfOptions$!: Observable<number>;
  @Select(GameSettingsState.getCategory) category$!: Observable<string>;
  @Select(GameSettingsState.getFirstPairingMode) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsState.getSecondPairingMode) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsState.getNumberOfRounds) numberOfRounds$!: Observable<number>;
  @Select(GameSettingsState.getSubjectArea) subjectArea$!: Observable<string>;
  @Select(CardStateQueries.cardStates$) cardStates$!: Observable<ICardFullStateModel[]>;
  
  shuffledWords: string[] = [];
  updatedCards: ICardFullStateModel[] = [];
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
      this.category$,
    ])
    .pipe(debounceTime(100)) // ✅ Prevents rapid multiple updates
    .subscribe(() => {});
   }

 
   // Function to shuffle an array
   shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Function to initialize words before game has started and set initial card states
  initializeCardStates(
    subjectArea: string,
    category: string, 
    numberOfOptions: number, 
    words: string[], 
    pairingModeFirst: string, 
    pairingModeSecond: string
  ): ICardFullStateModel[] {
     console.log('this function workds');
     
    // Step 1: Select `numberOfOptions` unique words randomly
    const selectedWords: string[] = this.getRandomUniqueWords(words, numberOfOptions);

    // Step 2: Pick one word to duplicate
    const wordToDuplicate: string = selectedWords[Math.floor(Math.random() * selectedWords.length)];

    // Step 3: Shuffle the selected words
    const shuffledSelectedWords: string[] = this.shuffleArray(selectedWords);

    // Step 4: Insert the duplicate at index 0
    this.shuffledWords = [wordToDuplicate, ...shuffledSelectedWords];
    
    return this.shuffledWords.map((word, index) => ({
      mode: index === 0 ? 'firstCard' : 'secondCard', 
      contentMedium: index === 0 ? this.formatString(pairingModeFirst) : this.formatString(pairingModeSecond),
      word: word, // word or image/video-path
      category: category, // category
      content: index === 0 ? this.getMediaPath(subjectArea, category, this.formatString(pairingModeFirst), word) : this.getMediaPath(subjectArea, category, this.formatString(pairingModeSecond), word),
      audioPath: this.getAudioPath(subjectArea, category, word), // audio path
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

  getAudioPath(subjectArea: string, category: string, word: string): string {
    const normalizedWord: string = this.normalizeCharacters(word);
    const formattedSubjectArea: string = this.formatString(subjectArea);
    const formattedCategory: string = this.formatString(category);
    return `/assets/subject-area/${formattedSubjectArea}/${formattedCategory}/audio/${normalizedWord}.mp3`;
  }

  getMediaPath(subjectArea: string, category: string, contentMedium: string, word: string): string {
    
    const normalizedWord: string = this.normalizeCharacters(word);
    const formattedSubjectArea: string = this.formatString(subjectArea);
    const formattedCategory: string = this.formatString(category);
    if (category === 'alfabetet'){
      if (contentMedium === 'ord') {
        return word;
      } else if (contentMedium === 'bild') {
        return `/assets/subject-area/${formattedSubjectArea}/${formattedCategory}/illustration/${word}.webp`;
      } else if (contentMedium === 'ritade-tecken') {
        return `/assets/subject-area/${formattedSubjectArea}/${formattedCategory}/ritade-tecken/${word}.webp`;
      } else if (contentMedium === 'tecken-som-stod') {
        return `/assets/subject-area/${formattedSubjectArea}/${formattedCategory}/video/${word}.mp4`;
      } else {
        return '';
      }
    } else {
      if (contentMedium === 'ord') {
        return word;
      } else if (contentMedium === 'bild') {
        return `/assets/subject-area/${formattedSubjectArea}/${formattedCategory}/illustration/${normalizedWord}.webp`;
      } else if (contentMedium === 'ritade-tecken') {
        return `/assets/subject-area/${formattedSubjectArea}/${formattedCategory}/ritade-tecken/${normalizedWord}.webp`;
      } else if (contentMedium === 'tecken-som-stod') {
        return `/assets/subject-area/${formattedSubjectArea}/${formattedCategory}/video/${normalizedWord}.mp4`;
      } else {
        return '';
      }
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
