import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Store} from "@ngxs/store";
import {UpdateSubjectArea} from "../state/subject-area-state-actions";
import {SubjectArea} from "../api/subject-area";
import {Observable} from "rxjs";
import {AsyncPipe, NgClass} from "@angular/common";
import {SubjectAreaStateQueries} from "../state/subject-area-state-queries";
import {CapitalizePipe} from "@utility/capitalize.pipe";
import {SettingsComponent} from "../../settings/settings.component";
import {PageTitleComponent} from "../../shared/page-title/page-title.component";
import {SubjectAreaNavComponent} from "./subject-area-nav/subject-area-nav.component";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [AsyncPipe, CapitalizePipe, NgClass, SettingsComponent, PageTitleComponent, SubjectAreaNavComponent],
  templateUrl: "./subject-area-location.component.html",
  styleUrl: "./subject-area-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectAreaLocationComponent implements OnInit {
  public subjectAreaCapitalized$: Observable<string> = this.store.select(SubjectAreaStateQueries.capitalizedSubjectArea$);
  public subjectAreaDataName$: Observable<string> = this.store.select(SubjectAreaStateQueries.subjectAreaDataName$);

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((params: ParamMap): void => {
      const subjectAreaDataName: string | null = params.get("subjectArea") as string;
      if (!subjectAreaDataName) return;
      const subjectArea: SubjectArea = subjectAreaDataName.replace(/-/g, " ") as SubjectArea;
      this.store.dispatch(new UpdateSubjectArea(subjectArea));
    });
  }

  protected readonly subjectAreaEnum = SubjectArea;
}
