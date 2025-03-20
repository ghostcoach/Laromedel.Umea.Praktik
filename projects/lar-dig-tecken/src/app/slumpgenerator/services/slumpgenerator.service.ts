import { Injectable, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
// Services
import { CardUtilsService } from '../../card/service/card-utils.service';
import { UtilsService } from '../../game/utils.service';
// States
import { CardStates } from '../../card/state/card.state';
import { GameState } from '../../game/state/game.state';
// Actions
import { UpdateCard } from '../../card/state/card.actions';
import { UpdateFlippedState} from '../../card/state/flipped.actions';
import { UpdateGameState, UpdateCurrentRound, ResetCurrentRound, UpdateGameOver, UpdateNumberOfGamesPlayed } from '../../game/state/game.actions';
// Interfaces
import { ICardFullStateModel } from '../../card/state/api/card-interface';


@Injectable({
  providedIn: 'root'
})

export class SlumpgeneratorService implements OnDestroy {
  // Selectors to retrieve the current game settings and card states
  @Select(CardStates.getCardStates) cardStates$!: Observable<ICardFullStateModel[]>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;
  @Select(GameState.getCurrentRound) currentRound$!: Observable<number>;
  @Select(GameState.getGameOver) gameOver$!: Observable<boolean>;
  private destroy$ = new Subject<void>();

  // Subjects to emit values to subscribers
  private gameStartedSubject = new BehaviorSubject<boolean>(false);
  gameStarted = this.gameStartedSubject.asObservable();
  private currentRoundSubject = new BehaviorSubject<number>(0);
  currentRound = this.currentRoundSubject.asObservable();
  private gameOverSubject = new BehaviorSubject<boolean>(false);
  gameOver = this.gameOverSubject.asObservable();
  
  currentRoundLessThanTotalRounds = true;

  // Constructor to inject the store, audio service, card utils service and utility service
  constructor(
    private store: Store, 
    private cardUtils: CardUtilsService,
    private utilsService: UtilsService
  ) {
      this.utilsService.initializeGameOnSettingsChange();
      this.gameStarted$.subscribe((value) => {
        this.gameStartedSubject.next(value); // Update whenever state changes
      });
      this.currentRound$.subscribe((value) => {
        this.currentRoundSubject.next(value); // Update whenever state changes
      });
      this.utilsService.getProceedToNextRound().subscribe((value) => {
        this.currentRoundLessThanTotalRounds = value;        
      }
      );
      
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
      this.store.dispatch(new UpdateCurrentRound());
   
      //Proceed to next round after delay
      setTimeout(()=> {        
        if(this.currentRoundLessThanTotalRounds){
          
          this.utilsService.reinitializeAndFlipBack();

        } else {
          
          setTimeout(() => {
            this.store.dispatch(new UpdateGameOver(true));

            setTimeout(() => {
              this.store.dispatch(new UpdateFlippedState({ flippedClass: 'flipped' }));
            }, 1000);

            setTimeout(() => {
              this.utilsService.reinitializeCardStates();
            }, 1500)
            

            // Keep gameOver true for 8 seconds, then reset it
            setTimeout(() => {
              this.store.dispatch(new UpdateGameOver(false));
              this.store.dispatch(new UpdateGameState(false));
              this.store.dispatch(new ResetCurrentRound());
              this.store.dispatch(new UpdateNumberOfGamesPlayed());

            }, 7900);
          }, 500)
        }

        }, 500)


    } else {
      this.store.dispatch(new UpdateCard(index, { 
        correctClass: 'incorrect-card' as 'incorrect-card' | 'correct-card' 
      }));

      this.cardUtils.playIncorrectAudio();
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

