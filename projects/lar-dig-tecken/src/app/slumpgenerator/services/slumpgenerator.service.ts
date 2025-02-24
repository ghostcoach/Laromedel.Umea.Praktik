import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { AudioService } from '../../services/audio/audio.service';

import { StartButtonStateQueries } from '../../start-button/state/start-button-queries';
import { UpdateStartButtonState } from '../../start-button/state/start-button-actions';

import { CardStates } from '../../card/state/card.state';
import { UpdateAllCards, UpdateCard } from '../../card/state/card.actions';
import { CardStateQueries } from '../../card/state/card.queries';
import { ICardFullStateModel } from '../../card/state/api/card-interface';

@Injectable({
  providedIn: 'root'
})
export class SlumpgeneratorService {

  constructor(private store: Store, public audioService: AudioService, ) { }

  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(StartButtonStateQueries.startBtnActive$) startBtnActive$!: Observable<boolean>;
  // @Select(CardStateQueries.cardStates$) cardStates$!: Observable<ICardFullStateModel[]>;

  gameStarted = false;
  currentRound = 0;
  maxRounds = 0;
  gameOver = false;


  // HELPER FUNCTIONS

  // Function to get an array of numbers from 1 to count
  getNumberArray(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  // GAME LOGIC

  // Function to start the game
  startGame(): void {
    this.gameStarted = true;
    this.currentRound = 0;
    this.store.dispatch(new UpdateStartButtonState(false));
    this.gameOver = false;

    setTimeout(() => {
      // Dispatch an action to update the flippedClass state of all cards
      const updatedCards = this.store.selectSnapshot(CardStates.getCardStates).map(card => ({
        ...card,
        flippedClass: 'not-flipped' as 'not-flipped' | 'flipped',
      }));
  
      this.store.dispatch(new UpdateAllCards(updatedCards));
    }, 500);
    
  }

  // Method to handle card clicks
  onCardClicked(content: string, index: number): void {
    if(!this.gameStarted) return;
    

    // Get the selected word
    const selectedWord: string = content;

    console.log('selectedWord:', selectedWord);
    
    //Check if the selected word is correct by comparing it with the content in the cardStates array at index 0
    const cardStates = this.store.selectSnapshot(CardStates.getCardStates);
    const isCorrect: boolean = selectedWord === cardStates[0]?.content;

    //Dispatch action to set selectedWord as correct or incorrect
    if(isCorrect){
      this.store.dispatch(new UpdateCard(index, { 
        correctClass: 'correct-card' as 'correct-card' | 'incorrect-card'
      }));
    
    //Number of rounds update
    this.currentRound++;

    //Flip cards
    const updatedCards = this.store.selectSnapshot(CardStates.getCardStates).map(card => ({
      ...card,
      flippedClass: 'flipped' as 'flipped' | 'not-flipped'
    }));
        
    this.store.dispatch(new UpdateAllCards(updatedCards));
              
    //Proceed to next round after delay
    setTimeout(()=> {
      if(this.currentRound < this.maxRounds){

        //Re-intialize cardStates
        this.store.dispatch(new UpdateAllCards(updatedCards));
       
      } else {
        //Re-enable clicks
        this.gameStarted = false; // Re-enable clicks
        this.gameOver = true;   
        
        // Keep gameOver true for 8 seconds, then reset it
        setTimeout(() => {
          this.gameOver = false;
        }, 7900);
      }

      }, 1000)


    } else {
      this.store.dispatch(new UpdateCard(index, { 
        correctClass: 'incorrect-card' as 'incorrect-card' | 'correct-card' 
      }));

      this.audioService.playIncorrectAudio();
    }

  }

}

