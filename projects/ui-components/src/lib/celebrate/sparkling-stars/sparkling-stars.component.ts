import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: "lib-sparkling-stars",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sparkling-stars.component.html",
  styleUrl: "./sparkling-stars.component.scss",
})
export class SparklingStarsComponent {
  @Input() isSmallerBox: boolean = false;
}
