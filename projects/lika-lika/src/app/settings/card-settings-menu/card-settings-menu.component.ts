import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {CommonModule} from "@angular/common";
import {PairModeSettingComponent} from "../pair-mode-setting/pair-mode-setting.component";
import {RouterLink} from "@angular/router";

@UntilDestroy()
@Component({
  selector: "app-card-settings-menu",
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule, PairModeSettingComponent, RouterLink],
  templateUrl: "./card-settings-menu.component.html",
  styleUrl: "./card-settings-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSettingsMenuComponent {}
