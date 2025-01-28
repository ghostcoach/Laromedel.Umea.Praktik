import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {GoToSettingsComponent} from "./go-to-settings/go-to-settings.component";
import {RouterLink} from "@angular/router";
import {SettingsMenuComponent} from "./settings-menu/settings-menu.component";
import {CardSettingsMenuComponent} from "./card-settings-menu/card-settings-menu.component";
import {PlayModeSettingComponent} from "./play-mode-setting/play-mode-setting.component";
import {UntilDestroy} from "@ngneat/until-destroy";
import {ReplayButtonComponent} from "./replay-button/replay-button.component";
import {LockButtonComponent} from "./lock-button/lock-button.component";
import {AsyncPipe} from "@angular/common";
import {Store} from "@ngxs/store";
import {SettingsStateQueries} from "./state/settings-state-queries";
import {Observable} from "rxjs";
import {FullscreenButtonComponent} from "./fullscreen-button/fullscreen-button.component";
import {InfoButtonComponent} from "./info-button/info-button.component";
import {HomeButtonComponent} from "./home-button/home-button.component";

@UntilDestroy()
@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    GoToSettingsComponent,
    RouterLink,
    SettingsMenuComponent,
    CardSettingsMenuComponent,
    PlayModeSettingComponent,
    ReplayButtonComponent,
    LockButtonComponent,
    AsyncPipe,
    FullscreenButtonComponent,
    InfoButtonComponent,
    HomeButtonComponent,
  ],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private store: Store = inject(Store);

  public isSettingsLocked$: Observable<boolean> = this.store.select(SettingsStateQueries.isSettingsLocked$);
}
