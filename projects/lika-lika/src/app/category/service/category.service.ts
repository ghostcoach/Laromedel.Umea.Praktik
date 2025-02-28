import {Injectable} from "@angular/core";
import {LocalStorageService} from "ngx-localstorage";
import {ICategoryContent} from "../api/category-content";
import {CategoryRepository} from "../data/category-repository";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private readonly CATEGORY_CONTENT_LOCAL_STORAGE_KEY: string = "categoryContent";

  constructor(
    private localStorageService: LocalStorageService,
    private categoryRepository: CategoryRepository,
  ) {}

  public getCategoryContent(): ICategoryContent[] {
    if (this.isLocalStorageDataAvailable()) {
      return this.loadDataFromLocalStorage();
    }

    const defaultCategoryContent: ICategoryContent[] = this.loadDefaultCategoryContent();
    this.localStorageService.set<ICategoryContent[]>(this.CATEGORY_CONTENT_LOCAL_STORAGE_KEY, defaultCategoryContent);

    return defaultCategoryContent;
  }

  public setLocalStorageCategoryContent(categoryContents: ICategoryContent[]): void {
    this.localStorageService.set<ICategoryContent[]>(this.CATEGORY_CONTENT_LOCAL_STORAGE_KEY, categoryContents);
  }

  private loadDataFromLocalStorage(): ICategoryContent[] {
    const localStorageData: ICategoryContent[] | null = this.localStorageService.get<ICategoryContent[]>(
      this.CATEGORY_CONTENT_LOCAL_STORAGE_KEY,
    );

    return localStorageData !== null ? localStorageData : [];
  }

  private loadDefaultCategoryContent(): ICategoryContent[] {
    const categoryContents: ICategoryContent[] = this.categoryRepository.getCategories().map((c) => ({
      categoryName: c.name,
      cardWordsToPlayWith: c.cards.map((card) => card.word),
    }));

    return categoryContents;
  }

  private isLocalStorageDataAvailable(): boolean {
    return this.localStorageService.get<ICategoryContent[]>(this.CATEGORY_CONTENT_LOCAL_STORAGE_KEY) !== null;
  }
}
