import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UpdateGameState, UpdateGameOver, UpdateCurrentRound, ResetCurrentRound } from './state/game.actions';
import { UpdateFlippedState } from '../card/state/flipped.actions';
import { Bildbegrepp, Instrument, Textilslojd, Traslojd } from '../category/api/estetisk-verksamhet';
import { Alfabetet, EnklaOrd, Kanslor, Skolord } from '../category/api/kommunikation';
import { Fordon, Frukt, GronsakerOchRotfrukter, Koksredskap, Livsmedel, Religion, Samhallet, Trafik } from '../category/api/vardagsaktiviteter';
import { Idrottshall, Rorselse, Sport, Vattensakerhet } from '../category/api/motorik';
import { Antal, Djur, Klader, Kroppen, Lagesord, Pengar, Vardagsteknik, Vaxter } from '../category/api/verklighetsuppfattning';
import { GameSettingsState } from '../settings/state/game-settings-state';
import { Select } from '@ngxs/store';
import { CardUtilsService } from '../card/service/card-utils.service';
import { InitializeCardStates } from '../card/state/card.actions';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, debounceTime, takeUntil } from 'rxjs/operators';
import { ICardFullStateModel } from '../card/state/api/card-interface';
import { GameState } from '../game/state/game.state';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  @Select(GameSettingsState.getCategory) category$!: Observable<string>;
  @Select(GameSettingsState.getNumberOfRounds) numberOfRounds$!: Observable<number>;
  @Select(GameSettingsState.getNumberOfOptions) numberOfOptions$!: Observable<number>;
  @Select(GameSettingsState.getFirstPairingMode) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsState.getSecondPairingMode) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsState.getSubjectArea) subjectArea$!: Observable<string>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;
  @Select(GameState.getCurrentRound) currentRound$!: Observable<number>;

  private destroy$ = new Subject<void>();
  
  // These are your original observables
  private proceedToNextRound$ = new BehaviorSubject<boolean>(false);
  private gameStartedSubject = new BehaviorSubject<boolean>(false);
  gameStarted = this.gameStartedSubject.asObservable();

  // Expose this as an observable
  proceedToNextRoundObservable$ = this.proceedToNextRound$.asObservable();

  currentRoundLessThanNumberOfRounds(): Observable<boolean> {
    return combineLatest([this.currentRound$, this.numberOfRounds$]).pipe(
      map(([currentRound, numberOfRounds]) => currentRound < numberOfRounds)
    );
  }

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
      this.store.dispatch(new UpdateGameState(true));
      this.store.dispatch(new UpdateCurrentRound());
      this.store.dispatch(new UpdateGameOver(false));
  
      setTimeout(() => {
        // Dispatch an action to update the FlippedState
        this.store.dispatch(new UpdateFlippedState({ flippedClass: 'not-flipped' }));
        
      }, 500);
      
      
    }

     // Method to initialize card states
     reinitializeCardStates(): void {
      
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

    reinitializeAndFlipBack(): void {
      
      this.store.dispatch(new UpdateFlippedState({ flippedClass: 'flipped' }));
      setTimeout(() => {
        this.reinitializeCardStates();
      }
      , 1000);
    
      setTimeout(() => {
        this.store.dispatch(new UpdateFlippedState({ flippedClass: 'not-flipped' }));
      }, 1200);
  
    }

    initializeGameOnSettingsChange(): void {
        combineLatest([this.numberOfOptions$, this.numberOfRounds$, this.category$, this.pairingModeFirst$, this.pairingModeSecond$])
          .pipe(
            debounceTime(100), // Prevent rapid consecutive updates
            takeUntil(this.destroy$) // Automatically unsubscribe on service destruction
          )
          .subscribe(() => {
            
            if (this.gameStartedSubject.value) {
              this.store.dispatch(new ResetCurrentRound());
              this.store.dispatch(new UpdateCurrentRound());
              this.reinitializeAndFlipBack();
            }
            
          });
      }
  
}
