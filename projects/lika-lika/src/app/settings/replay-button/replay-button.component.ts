import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {RestartMemoryGame} from "@games/memory-game-actions";

@UntilDestroy()
@Component({
  selector: "app-replay-button",
  standalone: true,
  imports: [],
  templateUrl: "./replay-button.component.html",
  styleUrl: "./replay-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplayButtonComponent {
  public store: Store = inject(Store);

  public handleReplay(): void {
    this.store.dispatch(new RestartMemoryGame());
  }
}
