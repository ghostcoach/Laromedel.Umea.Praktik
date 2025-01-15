import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {AsyncPipe} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {ToggleSubtitles} from "@media/subtitle-actions";
import {SubtitleQueries} from "@media/subtitle-queries";

@UntilDestroy()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "[app-subtitle-setting]",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./subtitle-setting.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtitleSettingComponent {
  public isSubtitleEnabled$: Observable<boolean> = this.store.select(SubtitleQueries.isSubtitleEnabled$);

  constructor(private store: Store) {}

  public handleSubtitleChange($event: MouseEvent | TouchEvent): void {
    $event.stopPropagation();
    this.store.dispatch(new ToggleSubtitles());
  }
}
