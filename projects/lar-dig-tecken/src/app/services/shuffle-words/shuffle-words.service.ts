import { Injectable } from '@angular/core';
import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { Select } from '@ngxs/store';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { ICardStatus } from '../../card/api/card-interface';

@Injectable({
  providedIn: 'root'
})
export class ShuffleWordsService {
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  shuffledWords: string[] = [];
  cardStates: { isFlipped: boolean, isSelected: boolean, isCorrect: boolean }[] = []
  cardStateClasses: string[] = [];
  currentRound = 0;
  maxRounds = 0;

  private cardStatesSubject = new BehaviorSubject<{ isFlipped: boolean, isSelected: boolean, isCorrect: boolean }[]>([]);
  cardStates$ = this.cardStatesSubject.asObservable();

  private cardStateClassesSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  cardStateClasses$ = this.cardStateClassesSubject.asObservable();

  constructor() {
    // Subscribe to both category$ and numberOfOptions$ at the same time
    combineLatest([
      this.numberOfOptions$, 
      this.numberOfRounds$, 
      this.category$])
      .subscribe(([numberOfOptions, numberOfRounds, category]) => {
        this.maxRounds = numberOfRounds;
        this.initializeWords(category, numberOfOptions);
      }
     
    );
   }


 // WORD SHUFFLING FUNCTIONS
 
   // Function to shuffle an array
   shuffleArray<T>(array: T[]): T[] {
     return array
       .map(value => ({ value, sort: Math.random() }))
       .sort((a, b) => a.sort - b.sort)
       .map(({ value }) => value);
   }
 
   // Function to shuffle words and flip back
   shuffleWordsAndFlipBack(category: string, numberOfOptions: number): void {
 
       //MÅSTE LÄGGA TILL SÅ ATT INTE SAMMA ORD KOMMER IGEN
       this.initializeWords(category, numberOfOptions);

       setTimeout(() => {
        const updatedStates: ICardStatus[] = this.cardStatesSubject.getValue().map(card => ({
          ...card,
          isFlipped: false
        }));

        this.cardStatesSubject.next(updatedStates);
       }, 500); // Adjust the delay as needed
   }
 
   // Function to initialize words from category
   initializeWords(category: string, numberOfOptions: number): void {
      const words: string[] = Object.values(BildbegreppWords);
     
      // Step 1: Select `numberOfOptions` unique words randomly
      const selectedWords: string[] = this.getRandomUniqueWords(words, numberOfOptions);
 
      // Step 2: Pick one word to duplicate
      const wordToDuplicate: string = selectedWords[Math.floor(Math.random() * selectedWords.length)];
 
      // Step 3: Insert the duplicate at index 0
      this.shuffledWords = [wordToDuplicate, ...selectedWords];
 
      // Step 4: Set all cards as flipped (hidden state)
      const initialStates: ICardStatus[] = this.shuffledWords.map(() => ({ 
        isFlipped: true, 
        isSelected: false, 
        isCorrect: false 
      }));
     this.cardStatesSubject.next(initialStates);
     
     this.cardStateClasses = [];

    //NEED TO FIX IT IS NOT CLEARING AS IT SHOULD
    this.cardStateClassesSubject.next(this.cardStateClasses);
   }
 
   // Helper function to retrieve a specified number of unique random words
  getRandomUniqueWords(words: string[], numberOfOptions: number): string[] {
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
}
