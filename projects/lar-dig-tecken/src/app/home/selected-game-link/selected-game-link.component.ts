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
  @Input() selectedGameEnum!: typeof SelectedGame;
  @Input() selectedGameKeys!:  (keyof typeof SelectedGame)[];
  @Input() isHomeVisible: boolean;
  
  public dynamicContent: Type<string>
  currentRoute: string;

  private componentMap: Record<string, Type<any>> = {
    slumpgenerator: SlumpgeneratorLocationComponent
  }

  constructor(private route: ActivatedRoute) {
    this.currentRoute = this.route.snapshot.url.join(''); 
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap): void => {
      
      const selectedGame: string | null = params.get("selected-game") as string;
      if (!selectedGame) return;
      this.dynamicContent = this.componentMap[selectedGame];

    });

  }

  // public get selectedGameDataName(): string {
  //   return this.selectedGame ? this.selectedGame.replace(/\s/g, "-").toLowerCase() : '';
  // }
  
  public getSelectedGameDataName(key: keyof typeof SelectedGame): string {
    return this.selectedGameEnum[key].replace(/\s/g, "-").toLowerCase();
  }

}
