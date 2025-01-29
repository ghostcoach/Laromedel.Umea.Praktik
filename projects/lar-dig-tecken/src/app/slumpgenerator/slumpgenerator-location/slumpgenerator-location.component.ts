import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from "@angular/common";
import { StartButtonComponent } from '../../start-button/start-button.component'
import { CardComponent } from '../../card/card.component';
import { RoundsComponent } from '../../rounds/rounds.component';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
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

  private shuffledWords: string[] = [];

  constructor() { }

  ngOnInit():void {
    this.numberOfOptions$.subscribe(numberOfOptions => {
      this.category$.subscribe(category => {
        this.initializeWords(category, numberOfOptions);
      })
    })
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

  initializeWords(category: string, numberOfOptions: number): void {
    const words = Object.values(BildbegreppWords);

    // Step 1: Select `numberOfOptions` unique words randomly
    const selectedWords = this.getRandomUniqueWords(words, numberOfOptions);
    console.log('selectedWords (before duplication):', selectedWords);

    // Step 2: Pick one word to duplicate
    const wordToDuplicate = selectedWords[Math.floor(Math.random() * selectedWords.length)];

    // Step 3: Insert the duplicate at index 0
    this.shuffledWords = [wordToDuplicate, ...selectedWords];

    console.log('shuffledWords (after duplication):', this.shuffledWords);
  }

  // Helper function to retrieve a specified number of unique random words
  private getRandomUniqueWords(words: string[], numberOfOptions: number): string[] {
    const selectedWords = [];
    const uniqueWordsSet = new Set<string>();

    // Ensure we select exactly 'numberOfOptions - 1' unique words
    while (selectedWords.length < numberOfOptions) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
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

    // const words = Object.values(BildbegreppWords);
    const normalizedCategory = this.normalizeCharacters(category);
    const normalizedWord = this.normalizeCharacters(this.shuffledWords[index % this.shuffledWords.length]);
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


  onCardClicked(content: string): void {
    console.log('Card clicked:', content);
  }

  
}

