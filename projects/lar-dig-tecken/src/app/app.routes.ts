import { Routes } from "@angular/router";
import { HomeLocationComponent } from "./home/home-location.component";
import { SelectedGameLinkComponent } from "./home/selected-game-link/selected-game-link.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeLocationComponent,
  },
  {
    path: "valt-spel/:selected-game",
    component: SelectedGameLinkComponent,
  },
  { path: "**", redirectTo: "" },
];

