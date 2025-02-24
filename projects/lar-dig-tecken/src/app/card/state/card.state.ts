import { Action, State, StateContext, Store, NgxsOnInit, Selector } from '@ngxs/store'
import { IMultipleFullStateModel, ICardFullStateModel } from './api/card-interface'
import { UpdateAllCards, UpdateCard, InitializeCardStates } from './card.actions'
import { GameSettingsState } from '../../settings/state/game-settings-state';
import { Injectable } from '@angular/core';
import { CardUtilsService } from '../service/card-utils.service';
import { Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
@State<IMultipleFullStateModel>({
    name: 'cardStates',
    defaults: {
      cardStates: [],
    },
  })
  export class CardStates implements NgxsOnInit {

    constructor(private store: Store, private cardUtils: CardUtilsService, private actions$: Actions) {}

    // **Selectors for game settings**
    @Select(GameSettingsState.getNumberOfOptions) numberOfOptions$!: Observable<number>;
    @Select(GameSettingsState.getCategory) category$!: Observable<string>;
    @Select(GameSettingsState.getFirstPairingMode) pairingModeFirst$!: Observable<string>;
    @Select(GameSettingsState.getSecondPairingMode) pairingModeSecond$!: Observable<string>;

    // NGXS lifecycle method - runs once when state initializes
    ngxsOnInit(ctx: StateContext<IMultipleFullStateModel>) {
        this.initializeCardStates(ctx);

          // **Subscribe to settings changes and reinitialize cards**
          this.numberOfOptions$.pipe(distinctUntilChanged()).subscribe(() => this.initializeCardStates(ctx));
          this.category$.pipe(distinctUntilChanged()).subscribe(() => this.initializeCardStates(ctx));
          this.pairingModeFirst$.pipe(distinctUntilChanged()).subscribe(() => this.initializeCardStates(ctx));
          this.pairingModeSecond$.pipe(distinctUntilChanged()).subscribe(() => this.initializeCardStates(ctx));
    }

    /** Selector to get the current card states */
    @Selector()
    static getCardStates(state: IMultipleFullStateModel): ICardFullStateModel[] {
        return state.cardStates;
    }
    

    /** Initialize card states dynamically */
    private initializeCardStates(ctx: StateContext<IMultipleFullStateModel>): void {
        const numberOfOptions = this.store.selectSnapshot(GameSettingsState.getNumberOfOptions);
        const category = this.store.selectSnapshot(GameSettingsState.getCategory);
        const words = Object.values(BildbegreppWords); // Fetch words dynamically
        const pairingModeFirst = this.store.selectSnapshot(GameSettingsState.getFirstPairingMode);
        const pairingModeSecond = this.store.selectSnapshot(GameSettingsState.getSecondPairingMode);

        // Generate initial card states using the utility service
        const initialCards = this.cardUtils.initializeCardStates(
            category, 
            numberOfOptions, 
            words,
            pairingModeFirst,
            pairingModeSecond
        );

        // ✅ Clear previous state before dispatching new cards
        ctx.setState({ cardStates: [] }); // Ensure no duplicates
        // Dispatch action to update the state
        ctx.dispatch(new InitializeCardStates(initialCards));
    }

    /** Set initial card states */
    @Action(InitializeCardStates)
    setInitialCardStates(
        ctx: StateContext<IMultipleFullStateModel>, 
        action: InitializeCardStates
    ):void {
        ctx.patchState({ cardStates: action.payload });
    }

    /** Update all cards with the given properties */
    @Action(UpdateAllCards)
    updateAllCards(
        ctx: StateContext<IMultipleFullStateModel>, 
        action: UpdateAllCards
    ): void {
        const updatedCards: ICardFullStateModel[] = ctx.getState().cardStates.map((card, index) => ({
            ...card,
            ...action.payload[index],
        }));

        ctx.patchState({ cardStates: updatedCards });
    }

    /** Update a specific card by index */
    @Action(UpdateCard)
    updateCard(ctx: StateContext<IMultipleFullStateModel>, action: UpdateCard): void {
        const currentCards = [...ctx.getState().cardStates];

        if (action.index < 0 || action.index >= currentCards.length) return;

        currentCards[action.index] = { ...currentCards[action.index], ...action.payload };
        ctx.patchState({ cardStates: currentCards });
    }
    
  }