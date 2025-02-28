import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {CardLinkComponent} from "../../shared/card-link/card-link.component";
import {SubjectArea} from "../../subject-area/api/subject-area";

@UntilDestroy()
@Component({
  selector: "app-start-nav",
  standalone: true,
  imports: [CardLinkComponent],
  templateUrl: "./start-nav.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartNavComponent {
  public subjectAreaEnum = SubjectArea;
}
