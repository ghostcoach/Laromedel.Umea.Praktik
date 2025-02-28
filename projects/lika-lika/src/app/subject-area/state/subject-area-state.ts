import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {UntilDestroy} from "@ngneat/until-destroy";

import {Injectable} from "@angular/core";
import {SubjectArea} from "../api/subject-area";
import {ISubjectAreaStateModel} from "../api/subject-area-state-model";
import {estetiskVerksamhetData} from "../../category/data/estetisk-verksamhet-data";
import {CategoryRepository} from "../../category/data/category-repository";
import {UpdateCategoryNamePlaying, UpdateSubjectArea, UpdateSubjectAreaCategories} from "./subject-area-state-actions";

const stateToken: StateToken<ISubjectAreaStateModel> = new StateToken<ISubjectAreaStateModel>("subjectAreaState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
    categories: estetiskVerksamhetData,
    categoryNamePlaying: "",
  },
})
@Injectable()
export class SubjectAreaState {
  constructor(private categoryRepository: CategoryRepository) {}

  @Action(UpdateSubjectArea)
  public updateSubjectArea({patchState}: StateContext<ISubjectAreaStateModel>, {subjectArea}: UpdateSubjectArea): void {
    patchState({
      subjectArea: subjectArea,
      categories: this.categoryRepository.getCategoriesBySubjectArea(subjectArea),
    });
  }

  @Action(UpdateSubjectAreaCategories)
  public updateSubjectAreaCategories({patchState}: StateContext<ISubjectAreaStateModel>, {categories}: UpdateSubjectAreaCategories): void {
    patchState({categories});
  }

  @Action(UpdateCategoryNamePlaying)
  public updateCategoryNamePlaying(
    {patchState}: StateContext<ISubjectAreaStateModel>,
    {categoryNamePlaying}: UpdateCategoryNamePlaying,
  ): void {
    patchState({categoryNamePlaying});
  }
}
