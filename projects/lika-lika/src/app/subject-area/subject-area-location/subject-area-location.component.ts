import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute, ParamMap, RouterLink} from "@angular/router";
import {Store} from "@ngxs/store";
import {UpdateSubjectArea} from "../state/subject-area-state-actions";
import {SubjectArea} from "../api/subject-area";
import {Observable} from "rxjs";
import {ICategoryViewModel} from "../../category/api/category-view-model";
import {AsyncPipe, NgClass, NgForOf} from "@angular/common";
import {SubjectAreaStateQueries} from "../state/subject-area-state-queries";
import {CapitalizePipe} from "@utility/capitalize.pipe";
import {SettingsComponent} from "../../settings/settings.component";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [NgForOf, AsyncPipe, RouterLink, CapitalizePipe, NgClass, SettingsComponent],
  templateUrl: "./subject-area-location.component.html",
  styleUrl: "./subject-area-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectAreaLocationComponent implements OnInit {
  public subjectAreaCapitalized$: Observable<string> = this.store.select(SubjectAreaStateQueries.capitalizedSubjectArea$);
  public subjectAreaDataName$: Observable<string> = this.store.select(SubjectAreaStateQueries.subjectAreaDataName$);
  public categories$: Observable<ICategoryViewModel[]> = this.store.select(SubjectAreaStateQueries.categories$);

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
}
