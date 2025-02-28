import {TestBed} from "@angular/core/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {CategoryContentState} from "../state/category-content-state";
import {ICategoryContent} from "../api/category-content";
import {AddCardToPlayWithAction, RemoveCardToPlayWithAction, UpdateCategoryContentAction} from "../state/category-content-state-actions";
import {SubjectArea} from "../../subject-area/api/subject-area";

describe("CategoryContentState", (): void => {
  let store: Store;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([CategoryContentState])],
    });

    store = TestBed.inject(Store);

    store.reset({
      categoryContentState: {
        categoryContents: [],
      },
    });
  });

  it("should add a card to play with for a specified category", (): void => {
    const initialState: ICategoryContent[] = [
      {
        categoryName: "bildbegrepp",
        cardWordsToPlayWith: ["färgpenna", "palett"],
      },
    ];
    store.reset({categoryContentState: {categoryContents: initialState}});

    store.dispatch(
      new AddCardToPlayWithAction(
        {
          name: "bildbegrepp",
          displayName: "",
          menuImage: "",
          menuImageAlt: "",
          cardFrontImage: "",
          cardBackImage: "",
          scoreCardImageAlt: "",
          scoreCardImage: "",
          subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
          cards: [],
          wordsNotInSameDeck: [],
        },
        "pensel",
      ),
    );

    const newState: ICategoryContent[] = store.selectSnapshot((state) => state.categoryContentState.categoryContents);
    expect(newState[0].cardWordsToPlayWith).toContain("pensel");
  });

  it("should remove a card to play with from a specified category", () => {
    const initialState: ICategoryContent[] = [
      {
        categoryName: "bildbegrepp",
        cardWordsToPlayWith: ["färgpenna", "palett", "pensel"],
      },
    ];
    store.reset({categoryContentState: {categoryContents: initialState}});

    store.dispatch(
      new RemoveCardToPlayWithAction(
        {
          name: "bildbegrepp",
          subjectArea: SubjectArea.ESTETISK_VERKSAMHET,
          cards: [],
          menuImage: "",
          menuImageAlt: "",
          cardFrontImage: "",
          cardBackImage: "",
          scoreCardImageAlt: "",
          scoreCardImage: "",
          wordsNotInSameDeck: [],
          displayName: "Bildbegrepp",
        },
        "pensel",
      ),
    );

    const newState: ICategoryContent[] = store.selectSnapshot((state) => state.categoryContentState.categoryContents);
    expect(newState[0].cardWordsToPlayWith).not.toContain("pensel");
    expect(newState[0].cardWordsToPlayWith.length).toBe(2);
  });

  it("should update category content", (): void => {
    store.dispatch(new UpdateCategoryContentAction("bildbegrepp", ["färgpenna", "palett", "pensel"]));

    const newState: ICategoryContent[] = store.selectSnapshot((state) => state.categoryContentState.categoryContents);
    expect(
      newState.find((category: {categoryName: string}): boolean => category.categoryName === "bildbegrepp")?.cardWordsToPlayWith.length,
    ).toBe(3);
  });
});
