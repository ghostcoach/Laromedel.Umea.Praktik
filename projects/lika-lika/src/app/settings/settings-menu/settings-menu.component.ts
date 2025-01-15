import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {NumberOfPlayersSettingComponent} from "../number-of-players-setting/number-of-players-setting.component";
import {SoundSettingComponent} from "../sound-setting/sound-setting.component";
import {SubtitleSettingComponent} from "../subtitle-setting/subtitle-setting.component";
import {TextTransformSettingComponent} from "../text-transform-setting/text-transform-setting.component";
import {CardCountSettingComponent} from "../card-count-setting/card-count-setting.component";

@UntilDestroy()
@Component({
  selector: "app-settings-menu",
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    NumberOfPlayersSettingComponent,
    SoundSettingComponent,
    SubtitleSettingComponent,
    TextTransformSettingComponent,
    CardCountSettingComponent,
  ],
  templateUrl: "./settings-menu.component.html",
  styleUrl: "./settings-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SettingsMenuComponent {}
