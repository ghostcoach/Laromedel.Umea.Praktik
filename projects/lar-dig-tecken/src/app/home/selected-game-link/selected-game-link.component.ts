import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {NgClass} from "@angular/common";
import {CapitalizePipe} from "@utility/capitalize.pipe";
import {RouterLink} from "@angular/router";
import { SelectedGame } from "../../selected-game/api/selected-game";

@UntilDestroy()
@Component({
  selector: "app-selected-game-link",
  // standalone: true,
  imports: [NgClass, CapitalizePipe, RouterLink],
  templateUrl: './selected-game-link.component.html',
  styleUrl: './selected-game-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedGameLinkComponent {
  @Input() selectedGame: SelectedGame;

  public get selectedGameDataName(): string {
    return this.selectedGame.replace(/\s/g, "-").toLowerCase();
  }
}
