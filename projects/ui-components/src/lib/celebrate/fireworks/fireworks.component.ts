import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: "lib-fireworks",
  standalone: true,
  imports: [],
  templateUrl: "./fireworks.component.html",
  styleUrl: "./fireworks.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FireworksComponent {}
