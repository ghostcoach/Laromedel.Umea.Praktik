import {TestBed} from "@angular/core/testing";
import {CategoryRepository} from "../data/category-repository";
import {ICategory} from "../api/category";
import {estetiskVerksamhetData} from "../data/estetisk-verksamhet-data";
import {ICategoryViewModel} from "../api/category-view-model";
import {SubjectArea} from "../../subject-area/api/subject-area";

const mockCategoryData: ICategory[] = estetiskVerksamhetData;

describe("CategoryRepository", (): void => {
  let categoryRepository: CategoryRepository;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [CategoryRepository, {provide: "categoryData", useValue: mockCategoryData}],
    });

    categoryRepository = TestBed.inject(CategoryRepository);
  });

  it("should return all categories", (): void => {
    const categories: ICategory[] = categoryRepository.getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should return categories by subject area of ESTETISK_VERKSAMHET", (): void => {
    const estetiskCategories: ICategoryViewModel[] = categoryRepository.getCategoriesBySubjectArea(SubjectArea.ESTETISK_VERKSAMHET);
    expect(estetiskCategories.length).toBeGreaterThan(0);
    estetiskCategories.forEach((category: ICategoryViewModel): void => {
      expect(category.subjectArea).toBe(SubjectArea.ESTETISK_VERKSAMHET);
    });
  });

  it("should return a specific category by name", (): void => {
    const category: ICategory = categoryRepository.getCategoryByName("bildbegrepp");
    expect(category).toBeDefined();
    expect(category.name).toBe("bildbegrepp");
  });

  it("should throw an error for a non-existent category name", (): void => {
    expect((): void => {
      categoryRepository.getCategoryByName("nonexistent category");
    }).toThrowError("Category with name nonexistent category not found");
  });
});
