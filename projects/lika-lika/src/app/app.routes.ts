import {Routes} from "@angular/router";
import {sharedRoutes} from "@shared/routes/shared-routes";
import {PdfRedirectComponent} from "@utility/pdf-redirect.component";
import {SubjectAreaLocationComponent} from "./subject-area/subject-area-location/subject-area-location.component";
import {SettingsLocationComponent} from "./settings/settings-location/settings-location.component";
import {MemoryGameLocationComponent} from "./memory-game/memory-game-location.component";
import {CardSettingsLocationComponent} from "./card-settings/card-settings-location.component";
import {StartLocationComponent} from "./start/start-location.component";

export const routes: Routes = [
  {
    path: "",
    component: StartLocationComponent,
  },
  {
    path: "lararhandledning",
    component: PdfRedirectComponent,
    data: {document: "Lärarhandledning-Lika-Lika.pdf"},
  },
  {
    path: "diplom",
    component: PdfRedirectComponent,
    data: {document: "Diplom.pdf"},
  },
  {
    path: "amnesomrade/:subjectArea",
    component: SubjectAreaLocationComponent,
  },
  {
    path: "installningar",
    component: SettingsLocationComponent,
  },
  {
    path: "kategori/:category",
    component: MemoryGameLocationComponent,
  },
  {
    path: "kort/:subjectArea",
    component: CardSettingsLocationComponent,
  },
  ...sharedRoutes,
];
