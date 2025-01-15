import {TestBed} from "@angular/core/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {SubjectAreaState} from "../state/subject-area-state";
import {ICategoryViewModel} from "../../category/api/category-view-model";
import {SubjectArea} from "../api/subject-area";
import {SubjectAreaStateQueries} from "../state/subject-area-state-queries";

describe("SubjectAreaStateQueries Selectors", () => {
  let store: Store;

  const mockCategories: ICategoryViewModel[] = [
    {
      name: "Category1",
      displayName: "Category 1 Display",
      logoImage: "category1-logo.png",
      menuImage: "category1-menu.png",
      subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
      menuImageAlt: "Category 1 Menu",
    },
    {
      name: "Category2",
      displayName: "Category 2 Display",
      logoImage: "category2-logo.png",
      menuImage: "category2-menu.png",
      menuImageAlt: "Category 2 Menu",
      subjectArea: SubjectArea.KOMMUNIKATION,
    },
  ];

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SubjectAreaState])],
    });

    store = TestBed.inject(Store);

    store.reset({
      ...store.snapshot(),
      subjectAreaState: {
        subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
        categories: mockCategories,
      },
    });
  });

  it("should select the current subject area", (): void => {
    const subjectArea: SubjectArea = store.selectSnapshot(SubjectAreaStateQueries.subjectArea$);
    expect(subjectArea).toBe(SubjectArea.ESTETISK_VERKSAMHET);
  });

  it("should select the current categories", (): void => {
    const categories: ICategoryViewModel[] = store.selectSnapshot(SubjectAreaStateQueries.categories$);
    expect(categories).toEqual(mockCategories);
  });
});
