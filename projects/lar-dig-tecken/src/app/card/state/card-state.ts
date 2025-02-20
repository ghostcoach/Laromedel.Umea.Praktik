import { Action, State, StateContext, Store, NgxsOnInit, Selector } from '@ngxs/store'
import { IMultipleCardStatesModel, ICardStateModel } from './api/card-interface'
import { UpdateAllCards, UpdateCard, InitializeCardStates } from './card-actions'
import { GameSettingsState } from '../../settings/state/game-settings-state';
import { Injectable } from '@angular/core';

@Injectable()
@State<IMultipleCardStatesModel>({
    name: 'cardState',
    defaults: {
      cardStates: [],
    },
  })
  export class CardState implements NgxsOnInit {

    constructor(private store: Store) {}
    
    // Selector to get the current card states
    @Selector()
    static getCardStates(state: IMultipleCardStatesModel): ICardStateModel[] {
      return state.cardStates;
    }

    // NGXS lifecycle method - runs once when state initializes
    ngxsOnInit(ctx: StateContext<IMultipleCardStatesModel>) {
        const numberOfOptions = this.store.selectSnapshot(GameSettingsState.getNumberOfOptions); // Get initial numberOfOptions
        ctx.dispatch(new InitializeCardStates(this.generateCardStates(numberOfOptions))); // Initialize cards
    }
  
    /** Utility function to generate initial card states */
    private generateCardStates(count: number): ICardStateModel[] {
        return Array.from({ length: count }, () => ({
            isFlipped: true,
            isSelected: false,
            isCorrect: false,
        }));
    }


    /** Set initial card states */
    @Action(InitializeCardStates)
    setInitialCardStates(
        ctx: StateContext<IMultipleCardStatesModel>, 
        action: InitializeCardStates
    ):void {
        ctx.patchState({ cardStates: action.payload });
    }

  
    /** Update all cards with the given properties */
    @Action(UpdateAllCards)
    updateAllCards(
        ctx: StateContext<IMultipleCardStatesModel>, 
        action: UpdateAllCards):void {
      const updatedCards: ICardStateModel[] = ctx.getState().cardStates.map((card) => ({
        ...card,
        ...action.payload,
      }));
  
      ctx.patchState({ cardStates: updatedCards });
    }
  
    /** Update a specific card by index */
    @Action(UpdateCard)
    updateCard(ctx: StateContext<IMultipleCardStatesModel>, action: UpdateCard):void {
        const currentCards = [...ctx.getState().cardStates];

      if (action.index < 0 || action.index >= currentCards.length) return;
  
      currentCards[action.index] = { ...currentCards[action.index], ...action.payload };
      ctx.patchState({ cardStates: currentCards });
    }
  }