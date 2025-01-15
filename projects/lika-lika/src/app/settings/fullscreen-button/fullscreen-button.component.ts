import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {ToggleFullscreen} from "@utility/application-state-actions";
import {ApplicationStateQueries} from "@utility/application-state-queries";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-fullscreen-button",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./fullscreen-button.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenButtonComponent {
  private store: Store = inject(Store);
  public isFullscreen$: Observable<boolean> = this.store.select(ApplicationStateQueries.isFullscreen$);

  public handleFullscreenToggle(): void {
    this.store.dispatch(new ToggleFullscreen());
  }
}
