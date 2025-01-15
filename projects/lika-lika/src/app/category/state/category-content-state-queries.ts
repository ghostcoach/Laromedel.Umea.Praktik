import {Selector} from "@ngxs/store";
import {CategoryContentState} from "./category-content-state";
import {ICategoryContentStateModel} from "../api/category-content-state-model";
import {ICategoryContent} from "../api/category-content";
import {ICategoryContentStorageData} from "../api/category-content-storage-data";

export class CategoryContentStateQueries {
  @Selector([CategoryContentState])
  public static categoryContents$(state: ICategoryContentStateModel): ICategoryContent[] {
    return state.categoryContents;
  }

  @Selector([CategoryContentStateQueries.categoryContents$])
  public static categoryContentStorageData$(categoryContents: ICategoryContent[]): ICategoryContentStorageData {
    return {categoryContents};
  }
}
