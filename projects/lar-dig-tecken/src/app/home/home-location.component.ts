import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {GameSettingsComponent} from '../settings/game-settings.component'
import {IGameSettingStateModel} from "../settings/state/api/game-settings-state-model";
import {CardContent} from '../../../../games/src/lib/api/card-content'
import {Category} from '../category/api/category'
import {RouterOutlet, Router, NavigationEnd, RouterLink} from "@angular/router";
import {SelectedGameLinkComponent} from  "./selected-game-link/selected-game-link.component";
import { SelectedGame } from "../selected-game/api/selected-game";
import {NgForOf, NgIf, CommonModule} from "@angular/common";
import {filter} from "rxjs/operators"; 
import { GameState } from "../game-state/state/game.state";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";


@UntilDestroy()
@Component({
  imports: [CommonModule, GameSettingsComponent, SelectedGameLinkComponent, NgForOf, RouterOutlet, NgIf, RouterLink],
  standalone: true,
  templateUrl: "./home-location.component.html",
  styleUrl: "./home-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLocationComponent implements OnInit {
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;

  public selectedGameEnum = SelectedGame;
  currentPath: string = '';
  isHomeVisible: boolean = false;


  constructor(private router: Router, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    // Subscribe to NavigationEnd events to detect route changes
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd), // Only process NavigationEnd events
      untilDestroyed(this) // Automatically unsubscribe on component destroy
    )
    .subscribe((event: NavigationEnd) => {
      this.currentPath = event.urlAfterRedirects;
      this.updateHomeVisibility()
    });

    // Initial check for the current path
    this.currentPath = this.router.url;
    this.updateHomeVisibility()
  }

  get selectedGameKeys() : (keyof typeof SelectedGame)[] {
    return Object.keys(this.selectedGameEnum) as (keyof typeof SelectedGame)[];
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

  updateHomeVisibility(): void {
    // Determine if the current path is the home page
    this.isHomeVisible = this.currentPath === '/';
    console.log('isHomeVisible:', this.isHomeVisible);
    

    // Trigger Angular's change detection
    this.cdr.detectChanges();
  }


}