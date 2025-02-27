import { Component, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Select, Store } from '@ngxs/store';
import { Observable, distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs/operators';

import { StartButtonComponent } from '../../start-button/start-button.component'
import { CardComponent } from '../../card/card.component';
import { RoundsComponent } from '../../rounds/rounds.component';
import { GameOverComponent } from '../../game-over/game-over.component';

import { GameSettingsStateQueries } from '../../settings/state/game-settings-queries';
import { SlumpgeneratorService } from '../services/slumpgenerator.service';
import { ICardFullStateModel } from '../../card/state/api/card-interface';
import { CardStates } from '../../card/state/card.state';
import { GameState } from '../../game-state/state/game.state';

@Component({
  selector: 'app-slumpgenerator-location',
  imports: [CommonModule, StartButtonComponent, CardComponent, RoundsComponent, GameOverComponent],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SlumpgeneratorLocationComponent implements OnInit{

  @Select(GameSettingsStateQueries.pairingModeFirstCard$) pairingModeFirst$!: Observable<string>;
  @Select(GameSettingsStateQueries.pairingModeSecondCard$) pairingModeSecond$!: Observable<string>;
  @Select(GameSettingsStateQueries.numberOfOptions$) numberOfOptions$!:Observable<number>
  @Select(GameSettingsStateQueries.numberOfRounds$) numberOfRounds$!:Observable<number>
  @Select(GameSettingsStateQueries.category$) category$!:Observable<string>
  @Select(CardStates.getCardStates) cardStates$!: Observable<ICardFullStateModel[]>;
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;

  firstCardState: ICardFullStateModel[] = [];
  secondCardState: ICardFullStateModel[] = [];

  //Get all card states and divide into to arrays, firstCardStates and secondCardStates
  constructor(
    private cdRef: ChangeDetectorRef, 
    private ngZone: NgZone, 
    public slumpgeneratorService: SlumpgeneratorService,
    private store: Store  
  ) {}

  ngOnInit():void {
    
    
    this.cardStates$.pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      map(cards => {

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
      
    ).subscribe(); // Don't forget to subscribe!
    
      
  }

  // HELPER FUNCTIONS

  // Function to get an array of numbers from 1 to count
  getNumberArray(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index + 1);
  }


}