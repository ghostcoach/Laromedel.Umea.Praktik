import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {CommonModule} from "@angular/common";
import {PairModeSettingComponent} from "../pair-mode-setting/pair-mode-setting.component";
import {RouterLink} from "@angular/router";
import {Store} from "@ngxs/store";
import {SubjectAreaStateQueries} from "../../subject-area/state/subject-area-state-queries";
import {Observable} from "rxjs";

@UntilDestroy()
@Component({
  selector: "app-card-settings-menu",
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule, PairModeSettingComponent, RouterLink],
  templateUrl: "./card-settings-menu.component.html",
  styleUrl: "./card-settings-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSettingsMenuComponent {
  private store: Store = inject(Store);
  public subjectAreaDataName$: Observable<string> = this.store.select(SubjectAreaStateQueries.subjectAreaDataName$);
}
