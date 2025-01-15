import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SpsmFooterComponent} from "@ui-components/spsm-footer.component";
import {SubjectAreaLinkComponent} from "./subject-area-link/subject-area-link.component";
import {SubjectArea} from "../subject-area/api/subject-area";
import {NgForOf} from "@angular/common";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [SpsmFooterComponent, SubjectAreaLinkComponent, NgForOf],
  templateUrl: "./home-location.component.html",
  styleUrl: "./home-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLocationComponent {
  public subjectAreaEnum = SubjectArea;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get subjectAreaKeys() {
    return Object.keys(this.subjectAreaEnum) as (keyof typeof SubjectArea)[];
  }
}
