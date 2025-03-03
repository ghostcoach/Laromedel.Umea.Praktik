import { Injectable, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { Alfabetet } from '../../category/api/alfabetet';
import { EnklaOrd } from '../../category/api/enkla-ord';
import { Kanslor } from '../../category/api/kanslor';
import { Skolord } from '../../category/api/skolord';
import { Sport } from '../../category/api/sport';
import { Idrottshall } from '../../category/api/idrottshall';

import { AudioService } from '../../services/audio/audio.service';
import { CardUtilsService } from '../../card/service/card-utils.service';

import { GameSettingsState } from '../../settings/state/game-settings-state';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';

import { CardStates } from '../../card/state/card.state';
import { InitializeCardStates, UpdateCard } from '../../card/state/card.actions';
import { ICardFullStateModel } from '../../card/state/api/card-interface';

import { UpdateFlippedState} from '../../card/state/flipped.actions';
import { UpdateGameState } from '../../game-state/state/game.actions';
import { GameState } from '../../game-state/state/game.state';
import { Category } from '../../category/api/category';
import { IGameSettingStateModel } from '../../settings/state/api/game-settings-state-model';


@Injectable({
  providedIn: 'root'
})
export class SlumpgeneratorService implements OnDestroy {
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(GameSettingsStateQueries.subjectArea$) subjectArea$!:Observable<string>
  @Select(CardStates.getCardStates) cardStates$!: Observable<ICardFullStateModel[]>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;

  private destroy$ = new Subject<void>();
  private gameStartedSubject = new BehaviorSubject<boolean>(false);
  gameStarted = this.gameStartedSubject.asObservable();

  currentRound = 0;
  maxRounds = 0;
  gameOver = false;
  startBtnActive = false;

  constructor(
    private store: Store, 
    public audioService: AudioService, 
    private cardUtils: CardUtilsService
  ) {
      this.maxRounds = this.store.selectSnapshot(GameSettingsState.getNumberOfRounds);
      this.initializeGameOnSettingsChange();
      this.gameStarted$.subscribe((value) => {
        this.gameStartedSubject.next(value); // Update whenever state changes
      });
      
  }

  // GAME LOGIC


  // Function to start the game
  startGame(): void {
    this.store.dispatch(new UpdateGameState(true));
    this.currentRound = 0;
    this.gameOver = false;

    setTimeout(() => {
      // Dispatch an action to update the FlippedState
      this.store.dispatch(new UpdateFlippedState({ flippedClass: 'not-flipped' }));
      
    }, 500);
    
    
  }

   // Method to initialize card states
   reinitializeCardStates(): void {

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
        case 'sport':
            selectedCategoryWords = Object.values(Sport);
            break;
        case 'idrottshall':
            selectedCategoryWords = Object.values(Idrottshall);
            break;
        default:
            selectedCategoryWords = Object.values(BildbegreppWords);
            break;
    }
    
    const numberOfOptions: number = this.store.selectSnapshot(GameSettingsState.getNumberOfOptions);
    const subjectArea: string = this.store.selectSnapshot(GameSettingsState.getSubjectArea);
    const category: string = this.store.selectSnapshot(GameSettingsState.getCategory);
    // const words: string[] = Object.values(BildbegreppWords); // Fetch words dynamically
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
      this.reinitializeCardStates()
    }, 1000);

    setTimeout(() => {
      this.store.dispatch(new UpdateFlippedState({ flippedClass: 'not-flipped' }));
    }
    , 1200);

  }

  private initializeGameOnSettingsChange(): void {
    combineLatest([this.numberOfOptions$, this.numberOfRounds$, this.category$, this.pairingModeFirst$, this.pairingModeSecond$])
      .pipe(
        debounceTime(100), // Prevent rapid consecutive updates
        takeUntil(this.destroy$) // Automatically unsubscribe on service destruction
      )
      .subscribe(([numberOfRounds]) => {
        
        if (this.gameStartedSubject.value) {
          this.store.dispatch(new UpdateGameState(false));
          this.currentRound = 0;
          this.maxRounds = numberOfRounds;
          this.reinitializeAndFlipBack();
        }
        
      });
  }


  // Method to handle card clicks
  onCardClicked(content: string, index: number): void {
    if (!this.gameStartedSubject.value) return;

    // Get the selected word
    const selectedWord: string = content;
    
    //Check if the selected word is correct by comparing it with the content in the cardStates array at index 0
    const cardStates: ICardFullStateModel[] = this.store.selectSnapshot(CardStates.getCardStates);
    const isCorrect: boolean = selectedWord === cardStates[0]?.word;

    //Dispatch action to set selectedWord as correct or incorrect
    if(isCorrect){
      this.store.dispatch(new UpdateCard(index, { 
        correctClass: 'correct-card' as 'correct-card' | 'incorrect-card'
      }));
    
      //Number of rounds update
      this.currentRound++;
   
      //Proceed to next round after delay
      setTimeout(()=> {
        if(this.currentRound < this.maxRounds){
          
          this.reinitializeAndFlipBack();

        } else {
          
          setTimeout(() => {
            this.gameOver = true;   

            setTimeout(() => {
              this.store.dispatch(new UpdateFlippedState({ flippedClass: 'flipped' }));
            }, 1000);

            setTimeout(() => {
              this.reinitializeCardStates()
            }, 1500)
            

            // Keep gameOver true for 8 seconds, then reset it
            setTimeout(() => {
              this.gameOver = false;
              this.store.dispatch(new UpdateGameState(false));
              this.currentRound = 0;

            }, 7900);
          }, 500)
        }

        }, 500)


    } else {
      this.store.dispatch(new UpdateCard(index, { 
        correctClass: 'incorrect-card' as 'incorrect-card' | 'correct-card' 
      }));

      this.audioService.playIncorrectAudio();
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

