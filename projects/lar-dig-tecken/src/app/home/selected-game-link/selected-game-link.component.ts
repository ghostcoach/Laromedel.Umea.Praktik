import {ChangeDetectionStrategy, Component, Input, Type} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import { SlumpgeneratorLocationComponent } from "../../slumpgenerator/slumpgenerator-location/slumpgenerator-location.component";
import {UntilDestroy} from "@ngneat/until-destroy";
import {CommonModule, NgClass} from "@angular/common";
import {CapitalizePipe} from "@utility/capitalize.pipe";
import {RouterLink} from "@angular/router";
import { SelectedGame } from "../../selected-game/api/selected-game";

@UntilDestroy()
@Component({
  selector: "app-selected-game-link",
  standalone: true,
  imports: [NgClass, CapitalizePipe, RouterLink, CommonModule],
  templateUrl: './selected-game-link.component.html',
  styleUrl: './selected-game-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedGameLinkComponent {
  @Input() selectedGame: SelectedGame;
  public dynamicContent: Type<any>

  private componentMap: Record<string, Type<any>> = {
    slumpgenerator: SlumpgeneratorLocationComponent
  }

  constructor(private route: ActivatedRoute) {
    // console.log('SelectedGameLinkComponent constructor');
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap): void => {
      // console.log('Params:', params);
      
      const selectedGame: string | null = params.get("selected-game") as string;
      if (!selectedGame) return;
      this.dynamicContent = this.componentMap[selectedGame];
      // console.log('Dynamic Content:', this.dynamicContent);  // Log to check the value of dynamicContent

    });

  }

  public get selectedGameDataName(): string {
    return this.selectedGame ? this.selectedGame.replace(/\s/g, "-").toLowerCase() : '';
  }

}
