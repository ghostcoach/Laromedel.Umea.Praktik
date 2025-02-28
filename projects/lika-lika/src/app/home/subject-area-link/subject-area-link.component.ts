import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SubjectArea} from "../../subject-area/api/subject-area";
import {RouterLink} from "@angular/router";
import {CategoryRepository} from "../../category/data/category-repository";
import {CapitalizePipe} from "@utility/capitalize.pipe";
import {NgClass} from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-subject-area-link",
  standalone: true,
  imports: [RouterLink, CapitalizePipe, NgClass],
  templateUrl: "./subject-area-link.component.html",
  styleUrl: "./subject-area-link.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectAreaLinkComponent implements OnInit {
  @Input() subjectArea: SubjectArea;

  private categoryRepository: CategoryRepository = inject(CategoryRepository);
  public cardBackImage: string;

  public get subjectAreaDataName(): string {
    return this.subjectArea.replace(/\s/g, "-").toLowerCase();
  }

  public ngOnInit(): void {
    this.cardBackImage = this.categoryRepository.getCategoryCardBackImage(this.subjectArea);
  }
}
