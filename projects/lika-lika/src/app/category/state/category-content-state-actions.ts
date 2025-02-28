import {ICategory} from "../api/category";

export class AddCardToPlayWithAction {
  static readonly type = "[CategoryContent] Add card to play with";

  constructor(
    public category: ICategory,
    public cardWord: string,
  ) {}
}

export class RemoveCardToPlayWithAction {
  static readonly type = "[CategoryContent] Remove card to play with";

  constructor(
    public category: ICategory,
    public cardWord: string,
  ) {}
}

export class UpdateCategoryContentAction {
  static readonly type = "[CategoryContent] Update category content";

  constructor(
    public categoryName: string,
    public cardWordsToPlayWith: string[],
  ) {}
}

export class LoadCategoryContent {
  static readonly type: string = "[CategoryContent] Load category content";
}

export class UpdateLocalStorageCategoryContent {
  static readonly type: string = "[CategoryContent] Update local storage category content";
}
