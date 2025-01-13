import { TestBed } from "@angular/core/testing";

import { BackgroundAudioService } from "./background-audio.service";
import { NgxsModule } from "@ngxs/store";
import { AudioState } from "./state/audio-state";

describe("BackgroundAudioService", () => {
  let service: BackgroundAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AudioState])],
    });
    service = TestBed.inject(BackgroundAudioService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
