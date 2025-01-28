import {Selector} from "@ngxs/store";
import {IMemoryGameStateModel} from "../api/memory-game-state-model";
import {MemoryCard} from "../api/memory-card";
import {MemoryGameState} from "./memory-game-state";
import {Injectable} from "@angular/core";

@Injectable()
export class MemoryGameQueries {
  @Selector([MemoryGameState])
  public static playingDeck$(state: IMemoryGameStateModel): MemoryCard[] {
    return state.playingDeck;
  }

  @Selector([MemoryGameState])
  public static isMemoryCardSelected$(state: IMemoryGameStateModel): (id: string) => boolean {
    return (id: string): boolean => state.selectedCards.some((card) => card.id === id);
  }

  @Selector([MemoryGameState])
  public static isMemoryCardMatched$(state: IMemoryGameStateModel): (id: string) => boolean {
    return (id: string): boolean => state.matchedCards.some((card) => card.id === id);
  }

  @Selector([MemoryGameState])
  public static isTwoCardsSelected$(state: IMemoryGameStateModel): boolean {
    return state.selectedCards.length === 2;
  }

  @Selector([MemoryGameState])
  public static hasMatchError$(state: IMemoryGameStateModel): boolean {
    return state.indicateError;
  }

  @Selector([MemoryGameState])
  public static isReadyToPlay$(state: IMemoryGameStateModel): boolean {
    return state.readyToPlay;
  }

  @Selector([MemoryGameState])
  public static cardStatus$(state: IMemoryGameStateModel): (id: string) => {
    isSelected: boolean;
    isMatched: boolean;
    hasError: boolean;
  } {
    return (id: string) => ({
      isSelected: state.selectedCards.some((c) => c.id === id),
      isMatched: state.matchedCards.some((c) => c.id === id),
      hasError: state.indicateError,
    });
  }

  @Selector([MemoryGameState])
  public static cardVisualState$(state: IMemoryGameStateModel): (id: string) => string {
    return (id: string) => {
      if (state.matchedCards.some((c) => c.id === id)) return "matched";
      if (state.indicateError && state.selectedCards.some((c) => c.id === id)) return "mismatched";
      if (state.selectedCards.some((c) => c.id === id)) return "selected";
      return "default";
    };
  }
}
