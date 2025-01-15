import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {AsyncPipe} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SettingsStateQueries} from "../state/settings-state-queries";
import {ToggleTextTransform} from "../state/settings-state-actions";

@UntilDestroy()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "[app-text-transform-setting]",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./text-transform-setting.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTransformSettingComponent {
  public isUppercaseTextTransform$: Observable<boolean> = this.store.select(SettingsStateQueries.isUpperCaseTextTransform$);

  constructor(private store: Store) {}

  public handleTextTransformChange($event: MouseEvent | TouchEvent): void {
    $event.stopPropagation();
    this.store.dispatch(new ToggleTextTransform());
  }
}
