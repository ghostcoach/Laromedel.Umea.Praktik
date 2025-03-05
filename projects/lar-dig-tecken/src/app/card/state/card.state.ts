import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Action, State, StateContext, Store, NgxsOnInit, Selector, Select, Actions } from '@ngxs/store'
import { Injectable } from '@angular/core';
import { IMultipleFullStateModel, ICardFullStateModel } from './api/card-interface'
import { UpdateAllCards, UpdateCard, InitializeCardStates, UpdateFlippedClass } from './card.actions'
import { GameSettingsState } from '../../settings/state/game-settings-state';
import { CardUtilsService } from '../service/card-utils.service';
import { Bildbegrepp, Instrument, Textilslojd, Traslojd } from '../../category/api/estetisk-verksamhet';
import { Alfabetet, EnklaOrd, Kanslor, Skolord } from '../../category/api/kommunikation';
import { Fordon, Frukt, GronsakerOchRotfrukter, Koksredskap, Livsmedel, Religion, Samhallet, Trafik } from '../../category/api/vardagsaktiviteter';
import { Idrottshall, Rorselse, Sport, Vattensakerhet } from '../../category/api/motorik';
import { Antal, Djur, Klader, Kroppen, Lagesord, Pengar, Vardagsteknik, Vaxter } from '../../category/api/verklighetsuppfattning';

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
        console.log('Initializing card states in card state running');
        
        let selectedCategoryWords: string[] = [];
        switch (this.store.selectSnapshot(GameSettingsState.getCategory)) {
            //Bildbegrepp
            case 'bildbegrepp':
                selectedCategoryWords = Object.values(Bildbegrepp);
                break;
            case 'instrument':
                selectedCategoryWords = Object.values(Instrument);
                break;
            case 'textilslöjd':
                selectedCategoryWords = Object.values(Textilslojd);
                break;
            case 'traslöjd':
                selectedCategoryWords = Object.values(Traslojd);
                break;
            //Kommunikation
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
            //Motorik
            case 'sport':
                selectedCategoryWords = Object.values(Sport);
                break;
            case 'idrottshall':
                selectedCategoryWords = Object.values(Idrottshall);
                break;
            case 'rörelse':
                selectedCategoryWords = Object.values(Rorselse);
                break;
            case 'vattensäkerhet':
                selectedCategoryWords = Object.values(Vattensakerhet);
                break;
            //Verklighetsuppfattning
            case 'antal':
                selectedCategoryWords = Object.values(Antal);
                break;
            case 'djur':
                selectedCategoryWords = Object.values(Djur);
                break;
            case 'kläder':
                selectedCategoryWords = Object.values(Klader);
                break;
            case 'kroppen':
                selectedCategoryWords = Object.values(Kroppen);
                break;
            case 'lägesord':
                selectedCategoryWords = Object.values(Lagesord);
                break;
            case 'pengar':
                selectedCategoryWords = Object.values(Pengar);
                break;
            case 'vardagsteknik':
                selectedCategoryWords = Object.values(Vardagsteknik);
                break;
            case 'växter':
                selectedCategoryWords = Object.values(Vaxter);
                break;
            //Vardagsaktiviteter
            case 'fordon':
                selectedCategoryWords = Object.values(Fordon);
                break;
            case 'frukt':
                selectedCategoryWords = Object.values(Frukt);
                break;
            case 'grönsaker och rotfrukter':
                selectedCategoryWords = Object.values(GronsakerOchRotfrukter);
                break;
            case 'köksredskap':
                selectedCategoryWords = Object.values(Koksredskap);
                break;
            case 'livsmedel':
                selectedCategoryWords = Object.values(Livsmedel);
                break;
            case 'religion':
                selectedCategoryWords = Object.values(Religion);
                break;
            case 'samhället':
                selectedCategoryWords = Object.values(Samhallet);
                break;
            case 'trafik':
                selectedCategoryWords = Object.values(Trafik);
                break;
            default:
                selectedCategoryWords = Object.values(Bildbegrepp);
                break;
        }
        
        const numberOfOptions: number = this.store.selectSnapshot(GameSettingsState.getNumberOfOptions);
        const subjectArea: string = this.store.selectSnapshot(GameSettingsState.getSubjectArea);
        const category: string = this.store.selectSnapshot(GameSettingsState.getCategory);
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