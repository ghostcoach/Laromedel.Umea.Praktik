import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AsyncPipe, Location} from "@angular/common";
import {RouterLink} from "@angular/router";

@UntilDestroy()
@Component({
  selector: "app-home-button",
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: "./home-button.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeButtonComponent {
  private location: Location = inject(Location);

  public goBack(): void {
    this.location.back();
  }
}
