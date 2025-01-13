import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [],
  templateUrl: "./home-location.component.html",
  styleUrl: "./home-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLocationComponent {}
