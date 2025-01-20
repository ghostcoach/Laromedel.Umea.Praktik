import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntilDestroy } from "@ngneat/until-destroy";
import { IGameSettingStateModel } from '../settings/state/api/game-settings-state-model';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GameSettingsStateQueries } from '../settings/state/game-settings-queries'
import { UpdateFirstPairingMode, UpdateSecondPairingMode, UpdateCategory, UpdateNumberOfOptions } from '../settings/state/game-settings-actions';
import { CardContent } from '../../../../games/src/lib/api/card-content'
import { Category } from "../category/api/category"

@UntilDestroy()
@Component({
  selector: 'app-game-settings',
  imports: [CommonModule],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameSettingsComponent {
  @Input() gameSettings: IGameSettingStateModel;
  @Output() settingSelected = new EventEmitter<string>();
  
  public firstCardOptions: CardContent[] = [
    CardContent.ILLUSTRATION,
    CardContent.RITADE_TECKEN,
    CardContent.TAKK,
    CardContent.WORD
  ];

  public secondCardOptions: CardContent[] = [
    CardContent.ILLUSTRATION,
    CardContent.RITADE_TECKEN,
    CardContent.TAKK,
    CardContent.WORD
  ];

  public categoryOptions: Category[] = [
    Category.ALLA,
    Category.BILDBEGREPP,
    Category.SYSLOJD,
    Category.TRASLOJD,
    Category.ALFABETET,
    Category.ENKLA_ORD,
    Category.KANSLOR,
    Category.SKOLORD,
    Category.SPORT,
    Category.VATTENSAKERHET,
    Category.RORELSE,
    Category.IDROTTSHALL,
    Category.KOKSREDSKAP,
    Category.FRUKT,
    Category.GRONSAKER_OCH_ROTFRUKTER,
    Category.LIVSMEDEL,
    Category.DJUR,
    Category.VAXTER,
    Category.ANTAL,
    Category.LAGESORD
  ];

  public numberOfOptions: number[] = [2, 3];

  public isFirstDropdownOpen = false;
  public isSecondDropdownOpen = false; 

  public pairingModeFirstCard$: Observable<string> = this.store.select(GameSettingsStateQueries.pairingModeFirstCard$);
  public pairingModeSecondCard$: Observable<string> = this.store.select(GameSettingsStateQueries.pairingModeSecondCard$);
  public category$: Observable<string> = this.store.select(GameSettingsStateQueries.category$);
  public numberOfRounds$: Observable<number> = this.store.select(GameSettingsStateQueries.numberOfRounds$);
  public numberOfOptions$: Observable<number> = this.store.select(GameSettingsStateQueries.numberOfOptions$);

  constructor(private store: Store){}

  toggleDropdown(type: 'first' | 'second') : void {
    if (type === 'first'){
      this.isFirstDropdownOpen = !this.isFirstDropdownOpen;
    } else {
      this.isSecondDropdownOpen = !this.isSecondDropdownOpen;
    }
  }

  updateFirstPairingMode(option: CardContent): void {
    this.store.dispatch(new UpdateFirstPairingMode(option));
    console.log('Första kortet upddaterat till', option);
  }

  updateSecondPairingMode(option: CardContent): void {
    this.store.dispatch(new UpdateSecondPairingMode(option));
    console.log('Andra kortet upddaterat till', option);
  }

  updateCategory(option: Category): void {
    this.store.dispatch(new UpdateCategory(option));
    console.log('Kategorin upddaterat till', option);
  }

  updateNumberOfOptions(option: number): void {
    this.store.dispatch(new UpdateNumberOfOptions(option));
    console.log('Antal uppdaterat till', option);
  }
  

}
