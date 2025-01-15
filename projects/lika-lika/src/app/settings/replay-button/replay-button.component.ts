import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";

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
  public handleReplay(): void {
    throw new Error("Not implemented");
  }
}
