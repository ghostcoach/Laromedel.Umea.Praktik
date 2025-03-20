import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, debounceTime, takeUntil } from 'rxjs/operators';

//Categories
import { Bildbegrepp, Instrument, Textilslojd, Traslojd } from '../category/api/estetisk-verksamhet';
import { Alfabetet, EnklaOrd, Kanslor, Skolord } from '../category/api/kommunikation';
import { Fordon, Frukt, GronsakerOchRotfrukter, Koksredskap, Livsmedel, Religion, Samhallet, Trafik } from '../category/api/vardagsaktiviteter';
import { Idrottshall, Rorselse, Sport, Vattensakerhet } from '../category/api/motorik';
import { Antal, Djur, Klader, Kroppen, Lagesord, Pengar, Vardagsteknik, Vaxter } from '../category/api/verklighetsuppfattning';

//Actions
import { InitializeCardStates } from '../card/state/card.actions';
import { UpdateGameState, UpdateGameOver, UpdateCurrentRound, ResetCurrentRound } from './state/game.actions';
import { UpdateFlippedState } from '../card/state/flipped.actions';

//States
import { GameSettingsState } from '../settings/state/game-settings-state';
import { ICardFullStateModel } from '../card/state/api/card-interface';
import { GameState } from '../game/state/game.state';

//Services
import { CardUtilsService } from '../card/service/card-utils.service';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  //Observables to get the current state
  @Select(GameSettingsState.getCategory) category$!: Observable<string>;
  @Select(GameSettingsState.getNumberOfRounds) numberOfRounds$!: Observable<number>;
  @Select(GameSettingsState.getNumberOfOptions) numberOfOptions$!: Observable<number>;
  @Select(GameSettingsState.getFirstPairingMode) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsState.getSecondPairingMode) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsState.getSubjectArea) subjectArea$!: Observable<string>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;
  @Select(GameState.getCurrentRound) currentRound$!: Observable<number>;

  // Unsubscribe from all observables when the service is destroyed
  private destroy$ = new Subject<void>();
  
  // BehaviorSubject to control the boolean value
  private proceedToNextRound$ = new BehaviorSubject<boolean>(false); // Boolean value to keep track if game can proceed to next round, to be used in slumpgenerator.service.ts
  private gameStartedSubject = new BehaviorSubject<boolean>(false); // Boolean value to keep track if game has started, to be used in slumpgenerator.service.ts
  gameStarted = this.gameStartedSubject.asObservable();

  // Expose this as an observable so that slumpgenerator.service.ts can subscribe to it
  proceedToNextRoundObservable$ = this.proceedToNextRound$.asObservable();

  // Function to check if the current round is less than the number of rounds
  currentRoundLessThanNumberOfRounds(): Observable<boolean> {
    return combineLatest([this.currentRound$, this.numberOfRounds$]).pipe(
      map(([currentRound, numberOfRounds]) => currentRound < numberOfRounds)
    );
  }

  // Constructor to inject the store and the card utility service
  constructor(private store: Store, private cardUtils: CardUtilsService) {
    // Automatically update the boolean whenever currentRound$ or numberOfRounds$ changes
    combineLatest([this.currentRound$, this.numberOfRounds$])
      .pipe(map(([currentRound, numberOfRounds]) => currentRound < numberOfRounds))
      .subscribe((result) => {
        this.proceedToNextRound$.next(result);
      });
      this.gameStarted$.subscribe((value) => {
        this.gameStartedSubject.next(value); // Update whenever state changes
      });
   }

   getProceedToNextRound(): Observable<boolean> {
    return this.proceedToNextRoundObservable$; // Expose as Observable
  }

  // Function to start the game
  startGame(): void {
    this.store.dispatch(new UpdateGameState(true)); // Dispatch an action to update the game state
    this.store.dispatch(new UpdateCurrentRound()); // Dispatch an action to update the current round
    this.store.dispatch(new UpdateGameOver(false)); // Dispatch an action to update the game over state
  
    setTimeout(() => {
      // Dispatch an action to update the FlippedState after delay
      this.store.dispatch(new UpdateFlippedState({ flippedClass: 'not-flipped' }));
      }, 500);
  }

  // Method to re-initialize card states
  reinitializeCardStates(): void {
    let selectedCategoryWords: string[] = [];

    //Check the selected category from state and fetch the words accordingly
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
      
      // Fetch the game settings from the settings state
      const numberOfOptions: number = this.store.selectSnapshot(GameSettingsState.getNumberOfOptions);
      const subjectArea: string = this.store.selectSnapshot(GameSettingsState.getSubjectArea);
      const category: string = this.store.selectSnapshot(GameSettingsState.getCategory);
      const words: string[] = selectedCategoryWords; // Fetch words dynamically
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
  
      // Dispatch action to update the state
      this.store.dispatch(new InitializeCardStates(initialCards));
    
    }

    // Method to flip cards  and reinitialize card states
    reinitializeAndFlipBack(): void {
      
      this.store.dispatch(new UpdateFlippedState({ flippedClass: 'flipped' }));
      setTimeout(() => {
        this.reinitializeCardStates();
      }
      , 1200);
    
      setTimeout(() => {
        this.store.dispatch(new UpdateFlippedState({ flippedClass: 'not-flipped' }));
      }, 1400);
  
    }

    // Method to re-initialize the game on settings change
    initializeGameOnSettingsChange(): void {
       //Subscribe to the observables to know when state changes and reinitialize the game
        combineLatest([this.numberOfOptions$, this.numberOfRounds$, this.category$, this.pairingModeFirst$, this.pairingModeSecond$])
          .pipe(
            debounceTime(100), // Prevent rapid consecutive updates
            takeUntil(this.destroy$) // Automatically unsubscribe on service destruction
          )
          .subscribe(() => {
            
            if (this.gameStartedSubject.value) {
              this.reinitializeAndFlipBack();
              this.store.dispatch(new ResetCurrentRound());
              this.store.dispatch(new UpdateCurrentRound());
            }
            
          });
      }
  
}
