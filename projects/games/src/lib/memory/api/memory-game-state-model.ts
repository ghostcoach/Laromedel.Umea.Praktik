import {MemoryCard} from "./memory-card";

export interface IMemoryGameStateModel {
  playingDeck: MemoryCard[];
  isSinglePlayerMode: boolean;
  selectedCards: MemoryCard[];
  queuedSelections: MemoryCard[];
  matchedCards: MemoryCard[];
  indicateError: boolean;
  readyToPlay: boolean;
  numberOfCardsDealt: number;
}
