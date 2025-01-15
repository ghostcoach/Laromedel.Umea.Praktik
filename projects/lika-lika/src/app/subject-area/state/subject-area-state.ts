import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {UntilDestroy} from "@ngneat/until-destroy";

import {Injectable} from "@angular/core";
import {SubjectArea} from "../api/subject-area";
import {ISubjectAreaStateModel} from "../api/subject-area-state-model";
import {estetiskVerksamhetData} from "../../category/data/estetisk-verksamhet-data";
import {CategoryRepository} from "../../category/data/category-repository";
import {UpdateSubjectArea, UpdateSubjectAreaCategories} from "./subject-area-state-actions";

const stateToken: StateToken<ISubjectAreaStateModel> = new StateToken<ISubjectAreaStateModel>("subjectAreaState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
    categories: estetiskVerksamhetData,
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
}
