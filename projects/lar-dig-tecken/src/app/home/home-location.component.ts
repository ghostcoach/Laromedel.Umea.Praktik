import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {GameSettingsComponent} from '../settings/game-settings.component'
import {IGameSettingStateModel} from "../settings/state/api/game-settings-state-model";
import {CardContent} from '../../../../games/src/lib/api/card-content'
import {Category} from '../category/api/category'
import {Store} from '@ngxs/store'
import {RouterLink, RouterOutlet, Router, ActivatedRoute} from "@angular/router";
import {SelectedGameLinkComponent} from  "./selected-game-link/selected-game-link.component";
import { SelectedGame } from "../selected-game/api/selected-game";
import {NgForOf, NgIf} from "@angular/common";


@UntilDestroy()
@Component({
  imports: [GameSettingsComponent, SelectedGameLinkComponent, NgForOf, RouterOutlet, NgIf],
  standalone: true,
  templateUrl: "./home-location.component.html",
  styleUrl: "./home-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLocationComponent {
  //In tsconfig paths to libraries are defined. To use them in the code, the following import statement is for example used:
  //import {MemoryCard} from "@games/memory-card";
  //Components that are routes should have to post-fix "Location" in their name and should not have a selector defined (e.g. "app-home-location")
  //If you do a change in a library, remember to re-build the library before you can see the changes in the project that uses the library.
  //To run the project, use the command "ng serve lar-dig-tecken" in the terminal.
  // CardMedia = {
  //   ILLUSTRATION: '/assets/subject-area/estetisk-verksamhet/bildbegrepp/illustration/lim.svg'
  // }
  isComponentLoaded = false;


  constructor(private router: Router){
    console.log(this.isComponentLoaded);
    
  }
  
  onComponentActivated(){
   this.isComponentLoaded = true
  }
  onComponentDeactivated() {
    this.isComponentLoaded = false;
  }

  public selectedGameEnum = SelectedGame;

  // get selectedGameKeys(){
  //   return Object.keys(this.selectedGameEnum) as (keyof typeof SelectedGame)[];
  // }
  get selectedGameKeys() {
    const keys = Object.keys(this.selectedGameEnum) as (keyof typeof SelectedGame)[];
    console.log('selectedGameKeys:', keys);
    return keys;
  }

  

  currentGameSettings: IGameSettingStateModel = {
    numberOfOptions: 3,
    pairingMode: {
      first: CardContent.ILLUSTRATION,
      second: CardContent.RITADE_TECKEN
    },
    category: Category.ALLA,
    numberOfRounds: 5
  }

  onSettingSelected(setting: string):void {
    console.log('Selected setting', setting);
    
  }



}