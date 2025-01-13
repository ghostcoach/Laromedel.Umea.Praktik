import {MemoryCard} from "./memory-card";

export interface IMemoryGameStateModel {
  playingDeck: MemoryCard[];
  isSinglePlayerMode: boolean;
  selectedCards: MemoryCard[];
  matchedCards: MemoryCard[];
  indicateError: boolean;
}
