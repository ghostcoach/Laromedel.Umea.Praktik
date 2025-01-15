import {TestBed} from "@angular/core/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {ICategoryContent} from "../api/category-content";
import {CategoryContentState} from "../state/category-content-state";
import {CategoryContentStateQueries} from "../state/category-content-state-queries";
import {ICategoryContentStorageData} from "../api/category-content-storage-data";

describe("CategoryContentStateQueries", (): void => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([CategoryContentState])],
    });

    store = TestBed.inject(Store);
    store.reset({
      categoryContentState: {
        categoryContents: [
          {
            categoryName: "SampleCategory",
            cardWordsToPlayWith: ["Word1", "Word2"],
          },
        ],
      },
    });
  });

  it("should select category contents from the state", (): void => {
    const categoryContents: ICategoryContent[] = store.selectSnapshot(CategoryContentStateQueries.categoryContents$);
    expect(categoryContents.length).toBe(1);
    expect(categoryContents[0].categoryName).toBe("SampleCategory");
    expect(categoryContents[0].cardWordsToPlayWith).toEqual(["Word1", "Word2"]);
  });

  it("should select category content storage data from the state", () => {
    const categoryContentStorageData: ICategoryContentStorageData = store.selectSnapshot(
      CategoryContentStateQueries.categoryContentStorageData$,
    );
    expect(categoryContentStorageData.categoryContents.length).toBe(1);
    expect(categoryContentStorageData.categoryContents[0].categoryName).toBe("SampleCategory");
    expect(categoryContentStorageData.categoryContents[0].cardWordsToPlayWith).toEqual(["Word1", "Word2"]);
  });
});
