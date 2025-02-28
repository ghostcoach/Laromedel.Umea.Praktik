import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {AsyncPipe} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MemorySettingsStateQueries} from "@games/memory-settings-state-queries";
import {ToggleTextTransform} from "@games/memory-state-actions";

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
  public isUppercaseTextTransform$: Observable<boolean> = this.store.select(MemorySettingsStateQueries.isUpperCaseTextTransform$);

  constructor(private store: Store) {}

  public handleTextTransformChange($event: MouseEvent | TouchEvent): void {
    $event.stopPropagation();
    this.store.dispatch(new ToggleTextTransform());
  }
}
