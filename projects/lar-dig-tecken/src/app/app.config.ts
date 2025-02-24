import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { routes } from "./app.routes";
import { environment } from "@shared/environments/environment";
import { provideAnimations } from "@angular/platform-browser/animations";

import { GameSettingsState } from '../app/settings/state/game-settings-state'
import { StartButtonState } from "./start-button/state/start-button-state";
// import { CardState } from "./card/state/card-state";
import { CardStates } from "./card/state/card.state";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      NgxsModule.forRoot([
        GameSettingsState,
        StartButtonState,
        // CardState,
        CardStates
      ], {
        developmentMode: !environment.production,
      }),
    ),
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: false,
      }),
    ),
    importProvidersFrom(
      NgxsLoggerPluginModule.forRoot({
        disabled: true,
      }),
    ),
  ],
};
