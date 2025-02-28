import {Component, inject} from "@angular/core";
import {EyeAnimationComponent} from "./eye-animation.component";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {TogglePlayMode} from "@games/memory-settings-state-actions";

@UntilDestroy()
@Component({
  selector: "app-play-mode-setting",
  standalone: true,
  imports: [EyeAnimationComponent],
  templateUrl: "./play-mode-setting.component.html",
  styleUrl: "./play-mode-setting.component.scss",
})
export class PlayModeSettingComponent {
  private store: Store = inject(Store);

  public handlePlayModeChange(): void {
    this.store.dispatch(new TogglePlayMode());
  }
}
