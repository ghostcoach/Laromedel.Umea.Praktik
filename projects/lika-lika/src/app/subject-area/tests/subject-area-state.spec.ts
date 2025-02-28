import {TestBed} from "@angular/core/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {ICategoryViewModel} from "../../category/api/category-view-model";
import {CategoryRepository} from "../../category/data/category-repository";
import {SubjectArea} from "../api/subject-area";
import {SubjectAreaState} from "../state/subject-area-state";
import {UpdateSubjectArea, UpdateSubjectAreaCategories} from "../state/subject-area-state-actions";
import {ISubjectAreaStateModel} from "../api/subject-area-state-model";

describe("SubjectAreaState", (): void => {
  let store: Store;
  let categoryRepositorySpy: jasmine.SpyObj<CategoryRepository>;

  const mockCategories: ICategoryViewModel[] = [
    {
      name: "painting",
      displayName: "Painting",
      menuImage: "painting-menu.png",
      menuImageAlt: "Painting Menu",
      subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
    },
    {
      name: "sculpture",
      displayName: "Sculpture",
      menuImage: "sculpture-menu.png",
      menuImageAlt: "Sculpture Menu",
      subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
    },
  ];

  beforeEach((): void => {
    categoryRepositorySpy = jasmine.createSpyObj("CategoryRepository", ["getCategoriesBySubjectArea"]);

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SubjectAreaState])],
      providers: [{provide: CategoryRepository, useValue: categoryRepositorySpy}],
    });

    store = TestBed.inject(Store);
  });

  it("should update subject area and categories when UpdateSubjectArea is dispatched", (): void => {
    categoryRepositorySpy.getCategoriesBySubjectArea.and.returnValue(mockCategories);

    store.dispatch(new UpdateSubjectArea(SubjectArea.ESTETISK_VERKSAMHET));

    const state: ISubjectAreaStateModel = store.selectSnapshot((state) => state.subjectAreaState);
    expect(state.subjectArea).toBe(SubjectArea.ESTETISK_VERKSAMHET);
    expect(state.categories).toEqual(mockCategories);
    expect(categoryRepositorySpy.getCategoriesBySubjectArea).toHaveBeenCalledWith(SubjectArea.ESTETISK_VERKSAMHET);
  });

  it("should update categories when UpdateSubjectAreaCategories is dispatched", (): void => {
    store.dispatch(new UpdateSubjectAreaCategories(mockCategories));

    const categories: ICategoryViewModel[] = store.selectSnapshot((state) => state.subjectAreaState.categories);
    expect(categories).toEqual(mockCategories);
  });
});
