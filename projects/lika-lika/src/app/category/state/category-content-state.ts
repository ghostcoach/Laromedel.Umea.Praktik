import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {UntilDestroy} from "@ngneat/until-destroy";
import {clone} from "ramda";
import {Injectable} from "@angular/core";
import {
  AddCardToPlayWithAction,
  LoadCategoryContent,
  RemoveCardToPlayWithAction,
  UpdateCategoryContentAction,
  UpdateLocalStorageCategoryContent,
} from "./category-content-state-actions";
import {ICategoryContentStateModel} from "../api/category-content-state-model";
import {ICategoryContent} from "../api/category-content";
import {CategoryService} from "../service/category.service";

const stateToken: StateToken<ICategoryContentStateModel> = new StateToken<ICategoryContentStateModel>("categoryContentState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    categoryContents: [],
  },
})
@Injectable()
export class CategoryContentState {
  constructor(private categoryService: CategoryService) {}

  @Action(AddCardToPlayWithAction)
  public addCardToPlayWith(
    {getState, patchState, dispatch}: StateContext<ICategoryContentStateModel>,
    {category, cardWord}: AddCardToPlayWithAction,
  ): void {
    const categoryContentsClone: ICategoryContent[] = clone(getState().categoryContents);
    const categoryIndex: number = categoryContentsClone.findIndex((c: ICategoryContent): boolean => c.categoryName === category.name);

    if (categoryIndex === -1) return;
    const categoryToUpdate: ICategoryContent = clone(categoryContentsClone[categoryIndex]);

    categoryToUpdate.cardWordsToPlayWith = [...categoryToUpdate.cardWordsToPlayWith, cardWord];

    categoryContentsClone[categoryIndex] = categoryToUpdate;

    patchState({categoryContents: categoryContentsClone});
    dispatch(new UpdateLocalStorageCategoryContent());
  }

  @Action(RemoveCardToPlayWithAction)
  public removeCardToPlayWith(
    {getState, patchState, dispatch}: StateContext<ICategoryContentStateModel>,
    {category, cardWord}: RemoveCardToPlayWithAction,
  ): void {
    const categoryContentsClone: ICategoryContent[] = clone(getState().categoryContents);
    const categoryIndex: number = categoryContentsClone.findIndex((c: ICategoryContent): boolean => c.categoryName === category.name);

    if (categoryIndex === -1) return;
    const categoryToUpdate: ICategoryContent = clone(categoryContentsClone[categoryIndex]);

    categoryToUpdate.cardWordsToPlayWith = categoryToUpdate.cardWordsToPlayWith.filter((c: string): boolean => c !== cardWord);

    categoryContentsClone[categoryIndex] = categoryToUpdate;

    patchState({categoryContents: categoryContentsClone});
    dispatch(new UpdateLocalStorageCategoryContent());
  }

  @Action(UpdateCategoryContentAction)
  public updateCategoryContent(
    {getState, patchState}: StateContext<ICategoryContentStateModel>,
    {categoryName, cardWordsToPlayWith}: UpdateCategoryContentAction,
  ): void {
    const state: ICategoryContentStateModel = getState();

    const categoryContentsClone: ICategoryContent[] = clone(state.categoryContents);

    const categoryIndex: number = categoryContentsClone.findIndex((c: ICategoryContent): boolean => c.categoryName === categoryName);

    if (categoryIndex === -1) {
      categoryContentsClone.push({
        categoryName: categoryName,
        cardWordsToPlayWith: cardWordsToPlayWith,
      });
    } else {
      categoryContentsClone[categoryIndex] = {
        categoryName: categoryName,
        cardWordsToPlayWith: cardWordsToPlayWith,
      };
    }

    patchState({categoryContents: categoryContentsClone});
  }

  @Action(LoadCategoryContent)
  public loadCategoryContent({patchState}: StateContext<ICategoryContentStateModel>): void {
    const categoryContents: ICategoryContent[] = this.categoryService.getCategoryContent();

    patchState({categoryContents: categoryContents});
  }

  @Action(UpdateLocalStorageCategoryContent)
  public updateLocalStorageCategoryContent({getState}: StateContext<ICategoryContentStateModel>): void {
    this.categoryService.setLocalStorageCategoryContent(getState().categoryContents);
  }
}
