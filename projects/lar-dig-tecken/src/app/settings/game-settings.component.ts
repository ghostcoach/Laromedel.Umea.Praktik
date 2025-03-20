import { Component, ChangeDetectionStrategy, Output, EventEmitter, ElementRef, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntilDestroy } from "@ngneat/until-destroy";
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GameSettingsStateQueries } from '../settings/state/game-settings-queries'// Queries
// Actions
import { 
  UpdateFirstPairingMode, 
  UpdateSecondPairingMode, 
  UpdateCategory, 
  UpdateSubjectArea, 
  UpdateNumberOfOptions, 
  UpdateNumberOfRounds 
} from '../settings/state/game-settings-actions';
//Interfaces
import { CardContent } from '@games/card-content'
import { Category, SubjectArea } from "../category/api/category"

@UntilDestroy()
@Component({
  selector: 'app-game-settings',
  imports: [CommonModule],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameSettingsComponent{
  @Output() settingSelected = new EventEmitter<string>(); // Output to parent component
  SubjectArea = SubjectArea;

  // Constructor to inject the store and element reference
  constructor(private store: Store, private eRef: ElementRef){}

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

  public subjectAreaOptions: SubjectArea[] = [
    SubjectArea.ALLA,
    SubjectArea.ESTETISK_VERKSAMHET,
    SubjectArea.KOMMUNIKATION,
    SubjectArea.MOTORIK,
    SubjectArea.VARDAGSAKTIVITETER,
    SubjectArea.VERKLIGHETSUPPFATTNING
  ];

  public estetiskVerksamhetOptions: Category[] = [
    Category.BILDBEGREPP,
    Category.TEXTILSLOJD,
    Category.TRASLOJD,
    Category.INSTRUMENT
  ];

  public kommunikationOptions: Category[] = [
    Category.ALFABETET,
    Category.ENKLA_ORD,
    Category.KANSLOR,
    Category.SKOLORD
  ];

  public motorikOptions: Category[] = [
    Category.SPORT,
    Category.VATTENSAKERHET,
    Category.RORELSE,
    Category.IDROTTSHALL
  ];

  public vardagsaktivitetOptions: Category[] = [
    Category.KOKSREDSKAP,
    Category.FRUKT,
    Category.GRONSAKER_OCH_ROTFRUKTER,
    Category.LIVSMEDEL,
    Category.FORDON,
    Category.RELIGION,
    Category.SAMHALLET,
    Category.TRAFIK
  ];

  public verklighetsuppfattningOptions: Category[] = [
    Category.DJUR,
    Category.VAXTER,
    Category.ANTAL,
    Category.LAGESORD,
    Category.KLADER,
    Category.PENGAR,
    Category.VARDAGSTEKNIK,
    Category.KROPPEN
  ];

  public numberOfOptions: number[] = [2, 3, 4];
  public numberOfRounds: number[] = [1, 2, 3, 4, 5];

  public isDropdownOpen = false;
  public isFirstCardSettingsDropdownOpen = false;
  public isSecondCardSettingsDropdownOpen = false;
  public isSubjectAreaSettingsDropdownOpen = false;
  public isCategorySettingsDropdownOpen = false;
  public isNumberOfOptionsSettingsDropdownOpen = false;
  public isNumberOfRoundsSettingsDropdownOpen = false;

  public isEstetiskVerksamhetDropdownOpen = false;
  public isKommunikationDropdownOpen = false;
  public isMotorikDropdownOpen = false;
  public isVardagsaktivitetDropdownOpen = false;
  public isVerklighetsuppfattningDropdownOpen = false;

  // Selectors to retrieve the current game settings to apply different css for user to know which options is selected
  public pairingModeFirstCard$: Observable<string> = this.store.select(GameSettingsStateQueries.pairingModeFirstCard$);
  public pairingModeSecondCard$: Observable<string> = this.store.select(GameSettingsStateQueries.pairingModeSecondCard$);
  public subjectArea$: Observable<string> = this.store.select(GameSettingsStateQueries.subjectArea$);
  public category$: Observable<string> = this.store.select(GameSettingsStateQueries.category$);
  public numberOfRounds$: Observable<number> = this.store.select(GameSettingsStateQueries.numberOfRounds$);
  public numberOfOptions$: Observable<number> = this.store.select(GameSettingsStateQueries.numberOfOptions$);

  buttonImg = '';
  arrowImg = 'assets/layout/icons/arrow-down.svg';

  // Function to toggle the main settings dropdown
  toggleDropdown() : void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if(this.isDropdownOpen){
      this.arrowImg = 'assets/layout/icons/arrow-up.svg';
    } else {
      this.arrowImg = 'assets/layout/icons/arrow-down.svg';
    }
  }

  // Function to close the dropdown when clicking or tabbing outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) : void {
    if (this.isDropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.arrowImg = 'assets/layout/icons/arrow-down.svg';
    }
  }

  // Function to toggle different settings dropdowns
  toggleSettingOptionsDropdown(type: 'firstCard' | 'secondCard' | 'subjectArea' | 'category' | 'rounds' | 'options') : void {
    if (type === 'firstCard'){
      this.isFirstCardSettingsDropdownOpen = !this.isFirstCardSettingsDropdownOpen;
      if(this.isFirstCardSettingsDropdownOpen){
        this.isSecondCardSettingsDropdownOpen = false;
        this.isCategorySettingsDropdownOpen = false;
        this.isNumberOfRoundsSettingsDropdownOpen = false;
        this.isNumberOfOptionsSettingsDropdownOpen = false;
        this.isSubjectAreaSettingsDropdownOpen = false;
      }
    } else if (type === 'secondCard') {
      this.isSecondCardSettingsDropdownOpen = !this.isSecondCardSettingsDropdownOpen;
      if(this.isSecondCardSettingsDropdownOpen){
        this.isFirstCardSettingsDropdownOpen = false;
        this.isCategorySettingsDropdownOpen = false;
        this.isNumberOfRoundsSettingsDropdownOpen = false;
        this.isNumberOfOptionsSettingsDropdownOpen = false;
        this.isSubjectAreaSettingsDropdownOpen = false;
      }
    } else if (type === 'category') {
      this.isCategorySettingsDropdownOpen = !this.isCategorySettingsDropdownOpen;
      if(this.isCategorySettingsDropdownOpen){
        this.isFirstCardSettingsDropdownOpen = false;
        this.isSecondCardSettingsDropdownOpen = false;
        this.isNumberOfRoundsSettingsDropdownOpen = false;
        this.isNumberOfOptionsSettingsDropdownOpen = false;
        this.isSubjectAreaSettingsDropdownOpen = false;
      }
    } else if (type === 'rounds') {
      this.isNumberOfRoundsSettingsDropdownOpen = !this.isNumberOfRoundsSettingsDropdownOpen;
      if(this.isNumberOfRoundsSettingsDropdownOpen){
        this.isFirstCardSettingsDropdownOpen = false;
        this.isSecondCardSettingsDropdownOpen = false;
        this.isCategorySettingsDropdownOpen = false;
        this.isNumberOfOptionsSettingsDropdownOpen = false;
        this.isSubjectAreaSettingsDropdownOpen = false;
      }
    } else if (type === 'options') {
      this.isNumberOfOptionsSettingsDropdownOpen = !this.isNumberOfOptionsSettingsDropdownOpen;
      if(this.isNumberOfOptionsSettingsDropdownOpen){
        this.isFirstCardSettingsDropdownOpen = false;
        this.isSecondCardSettingsDropdownOpen = false;
        this.isCategorySettingsDropdownOpen = false;
        this.isNumberOfRoundsSettingsDropdownOpen = false;
        this.isSubjectAreaSettingsDropdownOpen = false;
      }
    } else if (type === 'subjectArea') {
      this.isSubjectAreaSettingsDropdownOpen = !this.isSubjectAreaSettingsDropdownOpen;
      if(this.isSubjectAreaSettingsDropdownOpen){
        this.isFirstCardSettingsDropdownOpen = false;
        this.isSecondCardSettingsDropdownOpen = false;
        this.isCategorySettingsDropdownOpen = false;
        this.isNumberOfRoundsSettingsDropdownOpen = false;
        this.isNumberOfOptionsSettingsDropdownOpen = false;
      }
    }
  }
  // Function to toggle different subject area dropdowns
  toggleSubjectAreaDropdown(type: 'estetisk verksamhet' | 'kommunikation' | 'motorik' | 'vardagsaktivitet' | 'verklighetsuppfattning') : void {
    if (type === 'estetisk verksamhet')
     this.isEstetiskVerksamhetDropdownOpen = !this.isEstetiskVerksamhetDropdownOpen;
      if(this.isEstetiskVerksamhetDropdownOpen){
        this.isKommunikationDropdownOpen = false;
        this.isMotorikDropdownOpen = false;
        this.isVardagsaktivitetDropdownOpen = false;
        this.isVerklighetsuppfattningDropdownOpen = false;
      }
    else if (type === 'kommunikation')
     this.isKommunikationDropdownOpen = !this.isKommunikationDropdownOpen;
      if(this.isKommunikationDropdownOpen){
        this.isEstetiskVerksamhetDropdownOpen = false;
        this.isMotorikDropdownOpen = false;
        this.isVardagsaktivitetDropdownOpen = false;
        this.isVerklighetsuppfattningDropdownOpen = false;
      }
    else if (type === 'motorik')
     this.isMotorikDropdownOpen = !this.isMotorikDropdownOpen;
      if(this.isMotorikDropdownOpen){
        this.isEstetiskVerksamhetDropdownOpen = false;
        this.isKommunikationDropdownOpen = false;
        this.isVardagsaktivitetDropdownOpen = false;
        this.isVerklighetsuppfattningDropdownOpen = false;
      }
    else if (type === 'vardagsaktivitet')
     this.isVardagsaktivitetDropdownOpen = !this.isVardagsaktivitetDropdownOpen;
      if(this.isVardagsaktivitetDropdownOpen){
        this.isEstetiskVerksamhetDropdownOpen = false;
        this.isKommunikationDropdownOpen = false;
        this.isMotorikDropdownOpen = false;
        this.isVerklighetsuppfattningDropdownOpen = false;
      }
    else if (type === 'verklighetsuppfattning')
     this.isVerklighetsuppfattningDropdownOpen = !this.isVerklighetsuppfattningDropdownOpen;
      if(this.isVerklighetsuppfattningDropdownOpen){
        this.isEstetiskVerksamhetDropdownOpen = false;
        this.isKommunikationDropdownOpen = false;
        this.isMotorikDropdownOpen = false;
        this.isVardagsaktivitetDropdownOpen = false;
      }
  }

  //
  updateFirstPairingMode(option: CardContent): void {
    this.store.dispatch(new UpdateFirstPairingMode(option));
  }

  updateSecondPairingMode(option: CardContent): void {
    this.store.dispatch(new UpdateSecondPairingMode(option));
  }

  updateCategory(option: Category, subjectArea: SubjectArea): void {
    this.store.dispatch(new UpdateCategory(option));
    this.store.dispatch(new UpdateSubjectArea(subjectArea)); //Updates subject area based on category
  }

  updateNumberOfOptions(option: number): void {
    this.store.dispatch(new UpdateNumberOfOptions(option));
  }

  updateNumberOfRounds(option: number): void {
    this.store.dispatch(new UpdateNumberOfRounds(option));
  }


}
