import { Injectable, OnDestroy, Output } from '@angular/core';
import { dispatch, Select, Store } from '@ngxs/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { AudioService } from '../../services/audio/audio.service';

import { StartButtonStateQueries } from '../../start-button/state/start-button-queries';
import { StartButtonState } from '../../start-button/state/start-button-state';
import { UpdateStartButtonState } from '../../start-button/state/start-button-actions';

import { CardStates } from '../../card/state/card.state';
import { UpdateAllCards, UpdateCard, UpdateFlippedClass } from '../../card/state/card.actions';
import { CardStateQueries } from '../../card/state/card.queries';
import { ICardFullStateModel } from '../../card/state/api/card-interface';
import { CardUtilsService } from '../../card/service/card-utils.service';
import { InitializeCardStates } from '../../card/state/card.actions';

import { GameSettingsState } from '../../settings/state/game-settings-state';
import { BildbegreppWords } from '../../category/api/bildbegrepp';
import { BehaviorSubject } from 'rxjs';

import { UpdateFlippedState} from '../../card/state/flipped.actions';
import { FlippedState } from '../../card/state/flipped.state';
import { set } from 'ramda';


@Injectable({
  providedIn: 'root'
})
export class SlumpgeneratorService implements OnDestroy {
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(CardStates.getCardStates) cardStates$!: Observable<ICardFullStateModel[]>;
  
  private destroy$ = new Subject<void>();

  gameStarted = false;
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

       // Subscribe to startBtnActive updates
      this.store.select(StartButtonState.getStartButtonMode).pipe(
        takeUntil(this.destroy$)
      ).subscribe(value => {
        this.startBtnActive = value;  // Keep this up-to-date
      });
      
  }

  // GAME LOGIC


  // Function to start the game
  startGame(): void {
    console.log('game started');
    
    this.gameStarted = true;
    this.currentRound = 0;
    this.store.dispatch(new UpdateStartButtonState(false));
    this.gameOver = false;

    setTimeout(() => {
      // Dispatch an action to update the FlippedState
      this.store.dispatch(new UpdateFlippedState({ flippedClass: 'not-flipped' }));
      
    }, 500);
    
    
  }

   // Method to initialize card states
   reinitializeCardStates(): void {
    
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
    , 1500);

  }

  private initializeGameOnSettingsChange(): void {
    combineLatest([this.numberOfOptions$, this.numberOfRounds$, this.category$, this.pairingModeFirst$, this.pairingModeSecond$])
      .pipe(
        debounceTime(100), // Prevent rapid consecutive updates
        takeUntil(this.destroy$) // Automatically unsubscribe on service destruction
      )
      .subscribe(([numberOfOptions, numberOfRounds, category, pairingModeFirst, pairingModeSecond]) => {
        console.log('game settings changed');
        
        if (!this.startBtnActive) {
          this.gameStarted = false;
          this.currentRound = 0;
          this.maxRounds = numberOfRounds;
          this.reinitializeAndFlipBack();
        }
        
      });
  }


  // Method to handle card clicks
  onCardClicked(content: string, index: number): void {
  
    // Get the selected word
    const selectedWord: string = content;
    
    //Check if the selected word is correct by comparing it with the content in the cardStates array at index 0
    const cardStates = this.store.selectSnapshot(CardStates.getCardStates);
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
              // this.updateAllCardFlippedClass('flipped');
              this.store.dispatch(new UpdateFlippedState({ flippedClass: 'flipped' }));

              // this.store.dispatch(new UpdateAllCards(cardsDown));
            }, 1000);

            setTimeout(() => {
              this.reinitializeCardStates()
            }, 1500)
            

            // Keep gameOver true for 8 seconds, then reset it
            setTimeout(() => {
              this.gameOver = false;
              this.store.dispatch(new UpdateStartButtonState(true));
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

