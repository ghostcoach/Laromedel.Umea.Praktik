import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Action, State, StateContext, Store, NgxsOnInit, Selector, Select, Actions } from '@ngxs/store'
import { Injectable } from '@angular/core';
import { IMultipleFullStateModel, ICardFullStateModel } from './api/card-interface'
import { UpdateAllCards, UpdateCard, InitializeCardStates, UpdateFlippedClass } from './card.actions'
import { GameSettingsState } from '../../settings/state/game-settings-state';
import { CardUtilsService } from '../service/card-utils.service';
import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { Alfabetet } from '../../category/api/alfabetet';
import { EnklaOrd } from '../../category/api/enkla-ord';
import { Kanslor } from '../../category/api/kanslor';
import { Skolord } from '../../category/api/skolord';


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
    @Select(GameSettingsState.getSubjectArea) subjectArea$!: Observable<string>;

    // NGXS lifecycle method - runs once when state initializes
    ngxsOnInit(ctx: StateContext<IMultipleFullStateModel>):void {
        this.initializeCardStates(ctx);

          // **Subscribe to settings changes and reinitialize cards**
          this.numberOfOptions$.pipe(distinctUntilChanged()).subscribe(() => this.initializeCardStates(ctx));
          this.subjectArea$.pipe(distinctUntilChanged()).subscribe(() => this.initializeCardStates(ctx));
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
        let selectedCategoryWords: string[] = [];
        switch (this.store.selectSnapshot(GameSettingsState.getCategory)) {
            case 'bildbegrepp':
                selectedCategoryWords = Object.values(BildbegreppWords);
                break;
            case 'alfabetet':
                selectedCategoryWords = Object.values(Alfabetet);
                break;
            case 'enkla ord':
                selectedCategoryWords = Object.values(EnklaOrd);
                break;
            case 'känslor':
                selectedCategoryWords = Object.values(Kanslor);
                break;
            case 'skolord':
                selectedCategoryWords = Object.values(Skolord);
                break;
            default:
                selectedCategoryWords = Object.values(BildbegreppWords);
                break;
        }
        
        const numberOfOptions: number = this.store.selectSnapshot(GameSettingsState.getNumberOfOptions);
        const subjectArea: string = this.store.selectSnapshot(GameSettingsState.getSubjectArea);
        const category: string = this.store.selectSnapshot(GameSettingsState.getCategory);
        // const words: string[] = Object.values(BildbegreppWords); // Fetch words dynamically
        const words: string[] = selectedCategoryWords // Fetch words dynamically
        const pairingModeFirst: string = this.store.selectSnapshot(GameSettingsState.getFirstPairingMode);
        const pairingModeSecond: string = this.store.selectSnapshot(GameSettingsState.getSecondPairingMode);

        // Generate initial card states using the utility service
        const initialCards: ICardFullStateModel[] = this.cardUtils.initializeCardStates(
            subjectArea,
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
        const currentCards: ICardFullStateModel[] = [...ctx.getState().cardStates];

        if (action.index < 0 || action.index >= currentCards.length) return;

        currentCards[action.index] = { ...currentCards[action.index], ...action.payload };
        ctx.patchState({ cardStates: currentCards });
    }

    @Action(UpdateFlippedClass)
    updateFlippedClass(ctx: StateContext<IMultipleFullStateModel>, action: UpdateFlippedClass): void {
        const currentCards: ICardFullStateModel[] = ctx.getState().cardStates;
        const updatedCards: ICardFullStateModel[] = currentCards.map((card) => {
            return { ...card, flippedClass: action.payload }; // Update flippedClass for all cards
        });
        ctx.patchState({ cardStates: updatedCards });
    }
  
}