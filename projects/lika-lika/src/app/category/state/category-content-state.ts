import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {UntilDestroy} from "@ngneat/until-destroy";
import {clone} from "ramda";
import {Injectable} from "@angular/core";
import {
  AddCardToPlayWithAction,
  LoadCategoryContentFromLocalStorage,
  RemoveCardToPlayWithAction,
  UpdateCategoryContentAction,
} from "./category-content-state-actions";
import {ICategoryContentStateModel} from "../api/category-content-state-model";
import {ICategoryContent} from "../api/category-content";

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
  @Action(AddCardToPlayWithAction)
  public addCardToPlayWith(
    {getState, patchState}: StateContext<ICategoryContentStateModel>,
    {category, card}: AddCardToPlayWithAction,
  ): void {
    const categoryContentsClone: ICategoryContent[] = clone(getState().categoryContents);
    const categoryIndex: number = categoryContentsClone.findIndex((c: ICategoryContent): boolean => c.categoryName === category.name);

    if (categoryIndex === -1) return;
    const categoryToUpdate: ICategoryContent = clone(categoryContentsClone[categoryIndex]);

    categoryToUpdate.cardWordsToPlayWith = [...categoryToUpdate.cardWordsToPlayWith, card.word];

    categoryContentsClone[categoryIndex] = categoryToUpdate;

    patchState({categoryContents: categoryContentsClone});
  }

  @Action(RemoveCardToPlayWithAction)
  public removeCardToPlayWith(
    {getState, patchState}: StateContext<ICategoryContentStateModel>,
    {category, card}: RemoveCardToPlayWithAction,
  ): void {
    const categoryContentsClone: ICategoryContent[] = clone(getState().categoryContents);
    const categoryIndex: number = categoryContentsClone.findIndex((c: ICategoryContent): boolean => c.categoryName === category.name);

    if (categoryIndex === -1) return;
    const categoryToUpdate: ICategoryContent = clone(categoryContentsClone[categoryIndex]);

    categoryToUpdate.cardWordsToPlayWith = categoryToUpdate.cardWordsToPlayWith.filter((c: string): boolean => c !== card.word);

    categoryContentsClone[categoryIndex] = categoryToUpdate;

    patchState({categoryContents: categoryContentsClone});
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

  @Action(LoadCategoryContentFromLocalStorage)
  public loadCategoryContentFromLocalStorage(
    {patchState}: StateContext<ICategoryContentStateModel>,
    {categoryContentStorageData}: LoadCategoryContentFromLocalStorage,
  ): void {
    patchState({
      categoryContents: categoryContentStorageData.categoryContents,
    });
  }
}
