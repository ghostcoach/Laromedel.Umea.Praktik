import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from "@angular/core";
import {provideRouter} from "@angular/router";
import {routes} from "./app.routes";
import {NgxsModule} from "@ngxs/store";
import {environment} from "@shared/environments/environment";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {AudioState} from "@media/audio-state";
import {SubtitleState} from "@media/subtitle-state";
import {SubjectAreaState} from "./subject-area/state/subject-area-state";
import {SettingsState} from "./settings/state/settings-state";
import {CategoryContentState} from "./category/state/category-content-state";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ApplicationState} from "@utility/application-state";
import {MemoryGameState} from "@games/memory-game-state";
import {GameState} from "@games/game-state";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      NgxsModule.forRoot(
        [SettingsState, SubjectAreaState, ApplicationState, CategoryContentState, AudioState, SubtitleState, MemoryGameState, GameState],
        {
          developmentMode: !environment.production,
        },
      ),
    ),
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: environment.production,
      }),
    ),
    importProvidersFrom(
      NgxsLoggerPluginModule.forRoot({
        disabled: false,
      }),
    ),
  ],
};
