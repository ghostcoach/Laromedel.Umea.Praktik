import { Component, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Select, Store } from '@ngxs/store';
import { Observable, distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs/operators';

import { StartButtonComponent } from '../../game/start-button/start-button.component'
import { CardComponent } from '../../card/card.component';
import { RoundsComponent } from '../../game/rounds/rounds.component';
import { GameOverComponent } from '../../game/game-over/game-over.component';

import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { SlumpgeneratorService } from '../services/slumpgenerator.service';
import { ICardFullStateModel } from '../../card/state/api/card-interface';
import { CardStates } from '../../card/state/card.state';
import { GameState } from '../../game/state/game.state';

import { UtilsService } from '../../game/utils.service';

@Component({
  selector: 'app-slumpgenerator-location',
  imports: [CommonModule, StartButtonComponent, CardComponent, RoundsComponent, GameOverComponent],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SlumpgeneratorLocationComponent implements OnInit{
  // Selectors to retrieve the game settings and card states
  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(GameSettingsStateQueries.subjectArea$) subjectArea$!:Observable<string>
  @Select(CardStates.getCardStates) cardStates$!: Observable<ICardFullStateModel[]>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;
  @Select(GameState.getCurrentRound) currentRound$!: Observable<number>;
  @Select(GameState.getGameOver) gameOver$!: Observable<boolean>;

  firstCardState: ICardFullStateModel[] = [];
  secondCardState: ICardFullStateModel[] = [];

  //Get all card states and divide into to arrays, firstCardStates and secondCardStates
  constructor(
    private cdRef: ChangeDetectorRef, 
    private ngZone: NgZone, 
    public slumpgeneratorService: SlumpgeneratorService,
    private store: Store  ,
    public utilsService: UtilsService
  ) {}


  ngOnInit():void {
    this.cardStates$.pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      map(cards => {
        // Divide the cards into two arrays, one for firstCard and one for secondCards
        const newFirstCardState: ICardFullStateModel[] = cards.filter(card => card.mode === 'firstCard');
        const newSecondCardState: ICardFullStateModel[] = cards.filter(card => card.mode === 'secondCard');
    
        // Only update if the new state is different
        if (JSON.stringify(newFirstCardState) !== JSON.stringify(this.firstCardState)) {
          this.firstCardState = [...newFirstCardState];
        }
    
        if (JSON.stringify(newSecondCardState) !== JSON.stringify(this.secondCardState)) {
          this.secondCardState = [...newSecondCardState];
        }
    
        this.cdRef.markForCheck();
   
      })
      
    ).subscribe();
    
      
  }

  // HELPER FUNCTIONS

  // Function to get an array of numbers from 1 to count
  getNumberArray(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index + 1);
  }


}