import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VideoTimelineComponent } from "./video-timeline.component";
import { NgxsModule } from "@ngxs/store";
import { VideoState } from "@media/video.state";

describe("VideoTimelineComponent", () => {
  let component: VideoTimelineComponent;
  let fixture: ComponentFixture<VideoTimelineComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [VideoTimelineComponent, NgxsModule.forRoot([VideoState])],
    });

    fixture = TestBed.createComponent(VideoTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
