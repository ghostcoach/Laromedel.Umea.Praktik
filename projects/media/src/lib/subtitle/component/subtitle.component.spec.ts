import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { SubtitleComponent } from "./subtitle.component";
import { SubtitleState } from "../state/subtitle-state";
import {
  EnableSubtitle,
  HideSubtitle,
  MakeSubtitleVisible,
  UpdateSubtitleText,
} from "../state/subtitle-actions";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

describe("SubtitleComponent with Ngxs Store", (): void => {
  let component: SubtitleComponent;
  let fixture: ComponentFixture<SubtitleComponent>;
  let store: Store;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [SubtitleComponent, NgxsModule.forRoot([SubtitleState])],
    }).compileComponents();

    fixture = TestBed.createComponent(SubtitleComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    store.dispatch(new EnableSubtitle());
  });

  it("should create the component", (): void => {
    expect(component).toBeTruthy();
  });

  it("should display the subtitle text when subtitles are enabled", fakeAsync((): void => {
    store.dispatch(new MakeSubtitleVisible());

    store.dispatch(new UpdateSubtitleText({ row1: "Mock Subtitle", row2: "" }));

    tick();
    fixture.detectChanges();

    const subtitleElement: DebugElement = fixture.debugElement.query(
      By.css(".subtitle__text"),
    );

    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.nativeElement.textContent).toContain(
      "Mock Subtitle",
    );
  }));

  it("should hide the subtitle text when HideSubtitle action is dispatched", (): void => {
    store.dispatch(new HideSubtitle());

    fixture.detectChanges();

    const subtitleElement: DebugElement = fixture.debugElement.query(
      By.css(".subtitle__text"),
    );

    expect(subtitleElement).toBeFalsy();
  });

  it("should update the second subtitle row when UpdateSubtitleText is dispatched", fakeAsync((): void => {
    store.dispatch(new MakeSubtitleVisible());

    store.dispatch(
      new UpdateSubtitleText({ row1: "First Row", row2: "Second Row" }),
    );

    tick();
    fixture.detectChanges();

    const secondSubtitleRowElement: DebugElement = fixture.debugElement.query(
      By.css("#subtitle__row-2"),
    );

    expect(secondSubtitleRowElement).toBeTruthy();

    expect(secondSubtitleRowElement.nativeElement.textContent).toContain(
      "Second Row",
    );
  }));
});
