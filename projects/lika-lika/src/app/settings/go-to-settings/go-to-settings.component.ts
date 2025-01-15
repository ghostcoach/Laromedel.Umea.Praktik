import {Component} from "@angular/core";

import {RouterLink} from "@angular/router";

@Component({
  selector: "app-go-to-settings",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./go-to-settings.component.html",
  styleUrl: "./go-to-settings.component.scss",
})
export class GoToSettingsComponent {}
