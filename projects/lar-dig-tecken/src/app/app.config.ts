import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { routes } from "./app.routes";
import { environment } from "@shared/environments/environment";
import {GameSettingsState} from '../app/settings/state/game-settings-state'
import { provideAnimations } from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      NgxsModule.forRoot([
        GameSettingsState
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
