import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntilDestroy } from "@ngneat/until-destroy";
import { IGameSettingStateModel } from '../settings/state/api/game-settings-state-model';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GameSettingsStateQueries } from '../settings/state/game-settings-queries'
import { UpdateFirstPairingMode, UpdateSecondPairingMode, UpdateCategory, UpdateNumberOfOptions, UpdateNumberOfRounds } from '../settings/state/game-settings-actions';
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

  public numberOfOptions: number[] = [2, 3, 4];
  public numberOfRounds: number[] = [1, 2, 3, 4, 5];

  public isDropdownOpen = false;
  public isFirstCardSettingsDropdownOpen = false;
  public isSecondCardSettingsDropdownOpen = false;
  public isCategorySettingsDropdownOpen = false;
  public isNumberOfOptionsSettingsDropdownOpen = false;
  public isNumberOfRoundsSettingsDropdownOpen = false;

  public pairingModeFirstCard$: Observable<string> = this.store.select(GameSettingsStateQueries.pairingModeFirstCard$);
  public pairingModeSecondCard$: Observable<string> = this.store.select(GameSettingsStateQueries.pairingModeSecondCard$);
  public category$: Observable<string> = this.store.select(GameSettingsStateQueries.category$);
  public numberOfRounds$: Observable<number> = this.store.select(GameSettingsStateQueries.numberOfRounds$);
  public numberOfOptions$: Observable<number> = this.store.select(GameSettingsStateQueries.numberOfOptions$);

  constructor(private store: Store){}

  toggleDropdown() : void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSettingOptionsDropdown(type: 'firstCard' | 'secondCard' | 'category' | 'rounds' | 'options') : void {
    if (type === 'firstCard'){
      this.isFirstCardSettingsDropdownOpen = !this.isFirstCardSettingsDropdownOpen;
    } else if (type === 'secondCard') {
      this.isSecondCardSettingsDropdownOpen = !this.isSecondCardSettingsDropdownOpen;
    } else if (type === 'category') {
      this.isCategorySettingsDropdownOpen = !this.isCategorySettingsDropdownOpen;
    } else if (type === 'rounds') {
      this.isNumberOfRoundsSettingsDropdownOpen = !this.isNumberOfRoundsSettingsDropdownOpen;
    } else if (type === 'options') {
      this.isNumberOfOptionsSettingsDropdownOpen = !this.isNumberOfOptionsSettingsDropdownOpen;
    }
  }

  updateFirstPairingMode(option: CardContent): void {
    this.store.dispatch(new UpdateFirstPairingMode(option));
  }

  updateSecondPairingMode(option: CardContent): void {
    this.store.dispatch(new UpdateSecondPairingMode(option));
  }

  updateCategory(option: Category): void {
    this.store.dispatch(new UpdateCategory(option));
  }

  updateNumberOfOptions(option: number): void {
    this.store.dispatch(new UpdateNumberOfOptions(option));
  }

  updateNumberOfRounds(option: number): void {
    this.store.dispatch(new UpdateNumberOfRounds(option));
  }
  

}
