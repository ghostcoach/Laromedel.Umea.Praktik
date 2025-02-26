import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShuffleWordsService {

 // WORD SHUFFLING FUNCTIONS
 
   // Function to shuffle an array
   shuffleArray<T>(array: T[]): T[] {
     return array
       .map(value => ({ value, sort: Math.random() }))
       .sort((a, b) => a.sort - b.sort)
       .map(({ value }) => value);
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
