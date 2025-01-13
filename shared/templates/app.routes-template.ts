import { Routes } from "@angular/router";
import { HomeLocationComponent } from "./home/home-location.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeLocationComponent,
  },
  { path: "**", redirectTo: "" },
];
