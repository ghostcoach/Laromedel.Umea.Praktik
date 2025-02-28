import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {NgClass} from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-page-title",
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./page-title.component.scss",
  templateUrl: "./page-title.component.html",
})
export class PageTitleComponent {
  @Input() title: string | null;
  @Input() instructionText: string;
  @Input() subjectAreaName: string | null = "";
}
