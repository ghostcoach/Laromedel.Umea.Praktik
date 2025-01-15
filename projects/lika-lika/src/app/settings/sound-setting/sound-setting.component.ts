import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {AsyncPipe} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AudioStateQueries} from "@media/audio-state-queries";
import {ToggleSound} from "@media/audio-state-actions";

@UntilDestroy()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "[app-sound-setting]",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./sound-setting.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundSettingComponent {
  public isSoundEnabled$: Observable<boolean> = this.store.select(AudioStateQueries.isSoundEnabled$);

  constructor(private store: Store) {}

  public handleSoundChange($event: MouseEvent | TouchEvent): void {
    $event.stopPropagation();
    this.store.dispatch(new ToggleSound());
  }
}
