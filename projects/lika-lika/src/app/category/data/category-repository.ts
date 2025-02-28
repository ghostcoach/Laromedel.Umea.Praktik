import {Injectable} from "@angular/core";
import {ICategory} from "../api/category";
import {categoryData} from "./category-data";
import {SubjectArea} from "../../subject-area/api/subject-area";
import {ICategoryViewModel} from "../api/category-view-model";

@Injectable({
  providedIn: "root",
})
export class CategoryRepository {
  private readonly categories: ICategory[];

  constructor() {
    this.categories = categoryData;
  }

  public getCategories(): ICategory[] {
    return this.categories;
  }

  public getCategoriesBySubjectArea(subjectArea: SubjectArea): ICategoryViewModel[] {
    return this.categories.filter((category: ICategory): boolean => category.subjectArea === subjectArea);
  }

  public getCategoryByName(name: string): ICategory {
    const category: ICategory | undefined = this.categories.find((category: ICategory): boolean => category.name === name);

    if (!category) {
      throw new Error(`Category with name ${name} not found`);
    }

    return category;
  }

  public getCategoryWordsByCategoryName(name: string): string[] {
    const category: ICategory = this.getCategoryByName(name);

    return category.cards.map((card): string => card.word);
  }

  private getDefaultCategory(subjectArea: SubjectArea): ICategory {
    return this.categories.find((category: ICategory): boolean => category.subjectArea === subjectArea) as ICategory;
  }

  public getCategoryCardBackImage(subjectArea: SubjectArea): string {
    const category: ICategory = this.getDefaultCategory(subjectArea);

    return category.cardBackImage;
  }
}
