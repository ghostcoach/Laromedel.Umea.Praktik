import { ChangeDetectionStrategy, Component, Input, Type, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, RouterLink } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { CommonModule, NgClass } from "@angular/common";
import { CapitalizePipe } from "@utility/capitalize.pipe";
import { SelectedGame } from "../../selected-game/api/selected-game";
import { SlumpgeneratorLocationComponent } from "../../slumpgenerator/slumpgenerator-location/slumpgenerator-location.component";


@UntilDestroy()
@Component({
  selector: "app-selected-game-link",
  standalone: true,
  imports: [NgClass, CapitalizePipe, RouterLink, CommonModule],
  templateUrl: './selected-game-link.component.html',
  styleUrl: './selected-game-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedGameLinkComponent implements OnInit {
   // Inputs from parent component
  @Input() selectedGameEnum!: typeof SelectedGame; // Enum for the selected game
  @Input() selectedGameKeys!:  (keyof typeof SelectedGame)[]; // Selected game keys
  @Input() isHomeVisible: boolean; // Flag to determine if the home button should be visible
  
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
  
  public getSelectedGameDataName(key: keyof typeof SelectedGame): string {
    return this.selectedGameEnum[key].replace(/\s/g, "-").toLowerCase();
  }

}
