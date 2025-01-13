import { TestBed } from "@angular/core/testing";
import { Store } from "@ngxs/store";
import { SubtitleService } from "./subtitle.service";
import { DisplayTextAsSubtitle } from "./state/subtitle-actions";

describe("SubtitleService", (): void => {
  let service: SubtitleService;
  let storeSpy: jasmine.SpyObj<Store>;
  let mockTrackElement: HTMLTrackElement;
  let mockTextTrackCue: VTTCue;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ["dispatch"]);

    TestBed.configureTestingModule({
      providers: [SubtitleService, { provide: Store, useValue: storeSpy }],
    });

    service = TestBed.inject(SubtitleService);
    mockTrackElement = document.createElement("track") as HTMLTrackElement;
    mockTextTrackCue = new VTTCue(0, 10, "Test subtitle");

    Object.defineProperty(mockTrackElement.track, "activeCues", {
      get: () => ({
        length: 1,
        [0]: mockTextTrackCue,
      }),
      configurable: true,
    });
  });

  it("should initialize track element subtitle and set track mode to hidden", (): void => {
    service.initTrackSubtitle(mockTrackElement);

    expect(mockTrackElement.track.mode).toBe("hidden");
  });

  it("should dispatch DisplayTextAsSubtitle action when cuechange event is triggered", (): void => {
    service.initTrackSubtitle(mockTrackElement);

    const cueChangeEvent: Event = new Event("cuechange");
    mockTrackElement.dispatchEvent(cueChangeEvent);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      new DisplayTextAsSubtitle("Test subtitle", 10),
    );
  });

  it("should not dispatch any action if activeCues is null", (): void => {
    Object.defineProperty(mockTrackElement.track, "activeCues", {
      get: () => null,
      configurable: true,
    });

    service.initTrackSubtitle(mockTrackElement);

    const cueChangeEvent: Event = new Event("cuechange");
    mockTrackElement.dispatchEvent(cueChangeEvent);

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it("should not dispatch any action if activeCues is empty", (): void => {
    Object.defineProperty(mockTrackElement.track, "activeCues", {
      get: () => ({ length: 0 }),
      configurable: true,
    });

    service.initTrackSubtitle(mockTrackElement);

    const cueChangeEvent: Event = new Event("cuechange");
    mockTrackElement.dispatchEvent(cueChangeEvent);

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it("should not dispatch any action if cue is undefined", (): void => {
    Object.defineProperty(mockTrackElement.track, "activeCues", {
      get: () => ({ length: 1, [0]: undefined }),
      configurable: true,
    });

    service.initTrackSubtitle(mockTrackElement);

    const cueChangeEvent: Event = new Event("cuechange");
    mockTrackElement.dispatchEvent(cueChangeEvent);

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });
});
