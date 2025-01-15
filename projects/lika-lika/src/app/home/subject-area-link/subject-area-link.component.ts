import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SubjectArea} from "../../subject-area/api/subject-area";
import {NgClass} from "@angular/common";
import {CapitalizePipe} from "@utility/capitalize.pipe";
import {RouterLink} from "@angular/router";

@UntilDestroy()
@Component({
  selector: "app-subject-area-link",
  standalone: true,
  imports: [NgClass, CapitalizePipe, RouterLink],
  templateUrl: "./subject-area-link.component.html",
  styleUrl: "./subject-area-link.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectAreaLinkComponent {
  @Input() subjectArea: SubjectArea;

  public get subjectAreaDataName(): string {
    return this.subjectArea.replace(/\s/g, "-").toLowerCase();
  }
}
