import {MemoryCard} from "../api/memory-card";
import {shuffle} from "@utility/shuffle";
import {IPairingMode} from "../api/pairing-mode";
import {CardContent} from "../api/card-content";
import {IMemoryGameStateModel} from "../api/memory-game-state-model";

export function initializeDefaultState(): IMemoryGameStateModel {
  return {
    playingDeck: [],
    isSinglePlayerMode: true,
    selectedCards: [],
    matchedCards: [],
    indicateError: false,
    readyToPlay: false,
    numberOfCardsDealt: 0,
  };
}

export function isMemoryCardSelected(memoryCard: MemoryCard, selectedCards: MemoryCard[]): boolean {
  return selectedCards.some((selectedCard: MemoryCard): boolean => selectedCard.id === memoryCard.id);
}

export function isMemoryCardMatched(memoryCard: MemoryCard, matchedCards: MemoryCard[]): boolean {
  return matchedCards.some((matchedCard: MemoryCard): boolean => matchedCard.id === memoryCard.id);
}

export function createDeck(memoryCards: MemoryCard[], numberOfPlayingCards: number, pairingMode: IPairingMode): MemoryCard[] {
  const initialShuffledDeck: MemoryCard[] = shuffle<MemoryCard>(memoryCards);
  const uniqueCards: number = numberOfPlayingCards / 2;

  // Select unique cards and apply the first pairing mode
  const cardsToPlayWith: MemoryCard[] = initialShuffledDeck
    .slice(0, uniqueCards)
    .map((card: MemoryCard): MemoryCard => card.copy(pairingMode.first));

  // Create paired cards using the second pairing mode
  const pairedCards: MemoryCard[] = cardsToPlayWith.map((card: MemoryCard): MemoryCard => createMemoryCardPair(card, pairingMode.second));

  return shuffle([...cardsToPlayWith, ...pairedCards]);
}

export function createMemoryCardPair(memoryCard: MemoryCard, secondCardContent: CardContent): MemoryCard {
  return new MemoryCard(memoryCard.pairId, memoryCard.word, memoryCard.baseHref, secondCardContent);
}

export const {MEDIA_TIMEOUT, MATCH_TIMEOUT} = {
  MEDIA_TIMEOUT: "memoryCardMediaTimeout",
  MATCH_TIMEOUT: "matchedCardTimeout",
};
