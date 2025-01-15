import {Component} from "@angular/core";
import {SettingsComponent} from "../settings.component";
import {AsyncPipe, Location} from "@angular/common";
import {SoundSettingComponent} from "../sound-setting/sound-setting.component";
import {SubtitleSettingComponent} from "../subtitle-setting/subtitle-setting.component";
import {TextTransformSettingComponent} from "../text-transform-setting/text-transform-setting.component";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {SettingsStateQueries} from "../state/settings-state-queries";
import {TogglePlayMode} from "../state/settings-state-actions";
import {CardCountSettingComponent} from "../card-count-setting/card-count-setting.component";
import {PairModeSettingComponent} from "../pair-mode-setting/pair-mode-setting.component";

@Component({
  selector: "app-settings-location",
  standalone: true,
  imports: [
    SettingsComponent,
    AsyncPipe,
    SoundSettingComponent,
    SubtitleSettingComponent,
    TextTransformSettingComponent,
    CardCountSettingComponent,
    PairModeSettingComponent,
  ],
  templateUrl: "./settings-location.component.html",
  styleUrl: "./settings-location.component.scss",
})
export class SettingsLocationComponent {
  public isOpenCardsPlayMode$: Observable<boolean> = this.store.select(SettingsStateQueries.isOpenCardsPlayMode$);

  constructor(
    private location: Location,
    private store: Store,
  ) {}

  public goBack(): void {
    this.location.back();
  }

  public handlePlayModeChange(): void {
    this.store.dispatch(new TogglePlayMode());
  }
}
