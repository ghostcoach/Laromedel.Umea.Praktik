import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { routes } from "./app.routes";
import { environment } from "@shared/environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      NgxsModule.forRoot([], {
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
