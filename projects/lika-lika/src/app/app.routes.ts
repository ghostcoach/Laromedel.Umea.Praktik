import {Routes} from "@angular/router";
import {sharedRoutes} from "@shared/routes/shared-routes";
import {HomeLocationComponent} from "./home/home-location.component";
import {PdfRedirectComponent} from "@utility/pdf-redirect.component";
import {SubjectAreaLocationComponent} from "./subject-area/subject-area-location/subject-area-location.component";
import {SettingsLocationComponent} from "./settings/settings-location/settings-location.component";
import {MemoryGameLocationComponent} from "./memory-game/memory-game-location.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeLocationComponent,
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
  ...sharedRoutes,
];
