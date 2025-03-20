import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd, RouterLink } from "@angular/router";
import { NgIf, CommonModule} from "@angular/common";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { filter } from "rxjs/operators";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
// Components
import { GameSettingsComponent } from '../settings/game-settings.component'
import { SelectedGameLinkComponent } from  "./selected-game-link/selected-game-link.component";
// Interfaces
import { SelectedGame } from "../selected-game/api/selected-game";
// States
import { GameState } from "../game/state/game.state";
// Actions
import { UpdateGameOver, UpdateGameState, ResetNumberOfGamesPlayed, ResetCurrentRound } from "../game/state/game.actions";
import { UpdateFlippedState } from "../card/state/flipped.actions";
// Services
import { UtilsService } from "../game/utils.service";

@UntilDestroy()
@Component({
  imports: [CommonModule, GameSettingsComponent, SelectedGameLinkComponent, RouterOutlet, NgIf, RouterLink],
  standalone: true,
  templateUrl: "./home-location.component.html",
  styleUrl: "./home-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLocationComponent implements OnInit {
  // Selectors to retrieve state if the game has started
  @Select(GameState.getGameState) gameStarted$!: Observable<boolean>;

  public selectedGameEnum = SelectedGame; // Enum for the selected game
  currentPath: string = ''; // Current path of the application
  isHomeVisible: boolean = false; // Flag to determine if the home button should be visible
  arrowImg = 'assets/layout/icons/arrow-down.svg'; //dropdown arrow image

  // Constructor to inject the router, change detector, store and utility service
  constructor(private router: Router, private cdr: ChangeDetectorRef, public store: Store, private utilsService: UtilsService){}

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

  // Getter to retrieve the selected games
  get selectedGameKeys() : (keyof typeof SelectedGame)[] {
    return Object.keys(this.selectedGameEnum) as (keyof typeof SelectedGame)[];
  }

  // Function to update the visibility of the home button
  updateHomeVisibility(): void {
    // Determine if the current path is the home page
    this.isHomeVisible = this.currentPath === '/';

    // Trigger Angular's change detection
    this.cdr.detectChanges();
  }

  onHomeClick(): void {
    // Reset the game state and reinitialize the card states
    this.store.dispatch([
      new ResetCurrentRound(),
      new UpdateGameOver(false),
      new UpdateGameState(false),
      new ResetNumberOfGamesPlayed(),
      new UpdateFlippedState({ flippedClass: 'flipped' }),
    ]);
    this.utilsService.reinitializeCardStates()
  }


}
