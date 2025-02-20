import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NormalizeCharactersService {

  constructor() { }

  normalizeCharacters(input: string): string {
    return input
      .replace(/ä/g, 'a')
      .replace(/å/g, 'a')
      .replace(/ö/g, 'o');
  }
}
