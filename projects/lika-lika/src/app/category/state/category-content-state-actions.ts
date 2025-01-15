import {ICategory} from "../api/category";
import {ICategoryContentStorageData} from "../api/category-content-storage-data";
import {IMemoryCard} from "@games/memory-card";

export class AddCardToPlayWithAction {
  static readonly type = "[CategoryContent] Add card to play with";

  constructor(
    public category: ICategory,
    public card: IMemoryCard, //TODO: Interface is not used, replace with word-reference
  ) {}
}

export class RemoveCardToPlayWithAction {
  static readonly type = "[CategoryContent] Remove card to play with";

  constructor(
    public category: ICategory,
    public card: IMemoryCard,
  ) {}
}

export class UpdateCategoryContentAction {
  static readonly type = "[CategoryContent] Update category content";

  constructor(
    public categoryName: string,
    public cardWordsToPlayWith: string[],
  ) {}
}

export class LoadCategoryContentFromLocalStorage {
  static readonly type = "[CategoryContent] Load category content from local storage";

  constructor(public categoryContentStorageData: ICategoryContentStorageData) {}
}
