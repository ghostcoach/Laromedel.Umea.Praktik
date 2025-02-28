import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SubjectArea} from "../subject-area/api/subject-area";
import {ICategoryViewModel} from "../category/api/category-view-model";
import {SettingsComponent} from "../settings/settings.component";
import {ICategory} from "../category/api/category";
import {CategoryRepository} from "../category/data/category-repository";
import {MemoryCardTableComponent} from "./memory-card-table/memory-card-table.component";
import {CapitalizePipe} from "@utility/capitalize.pipe";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [SettingsComponent, NgForOf, ReactiveFormsModule, FormsModule, MemoryCardTableComponent, CapitalizePipe],
  templateUrl: "./card-settings-location.component.html",
  styleUrl: "./card-settings-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSettingsLocationComponent implements OnInit {
  public subjectArea: SubjectArea;
  public categories: ICategoryViewModel[];
  public category: ICategoryViewModel;
  public categoryData: WritableSignal<ICategory | undefined> = signal<ICategory | undefined>(undefined);
  public currentCategoryName: string;
  public subjectAreas: SubjectArea[] = Object.values(SubjectArea);

  constructor(
    private route: ActivatedRoute,
    private categoryRepository: CategoryRepository,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((params: ParamMap): void => {
      const subjectAreaDataName: string | null = params.get("subjectArea") as string;
      if (!subjectAreaDataName) return;
      const subjectArea: SubjectArea = subjectAreaDataName.replace(/-/g, " ") as SubjectArea;
      this.updateSubjectArea(subjectArea);
    });
  }

  public handleSubjectAreaChange(subjectArea: SubjectArea): void {
    this.updateSubjectArea(subjectArea);
  }

  public handleCategoryChange(categoryName: string): void {
    this.updateCategory(categoryName);
  }

  private updateSubjectArea(subjectArea: SubjectArea): void {
    this.subjectArea = subjectArea;
    this.categories = this.categoryRepository.getCategoriesBySubjectArea(this.subjectArea);
    this.updateCategory(this.categories[0].name);
  }

  private updateCategory(category: string): void {
    this.currentCategoryName = category;
    this.categoryData.set(this.categoryRepository.getCategoryByName(this.currentCategoryName));
  }
}
