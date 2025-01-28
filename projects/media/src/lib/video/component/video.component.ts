import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {VideoStateQueries} from "../state/video-state-queries";
import {ResetVideo, UpdateVideoStatus} from "../state/video-state-actions";
import {DOCUMENT, NgIf} from "@angular/common";
import {VideoExtension} from "../api/video-extension";
import {VideoStatus} from "../api/video-status";

@UntilDestroy()
@Component({
  selector: "lib-video",
  standalone: true,
  imports: [NgIf],
  templateUrl: "./video.component.html",
  styleUrl: "./video.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public baseSrc: string | null;
  @Input() public posterSrc: string = "";
  @Input() public id: string = "";
  @Input() public trackSrc: string;
  @Input() public isJumpToTimestampSupported: boolean = false;

  @ViewChild("videoElement") public videoElement: ElementRef<HTMLVideoElement>;

  public webmSrc: string;
  public mp4Src: string;

  // @Select(SettingsStateQueries.isSoundEnabled$)
  // public isSoundEnabled$!: Observable<boolean>;

  public videoStatus$: Observable<VideoStatus> = inject(Store).select(VideoStateQueries.videoStatus$);

  public jumpToTimestamp$: Observable<number> = inject(Store).select(VideoStateQueries.jumpToTimestamp$);

  constructor(
    private store: Store,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  public handleOnEnded(): void {
    this.store.dispatch(new UpdateVideoStatus(VideoStatus.ENDED));
  }

  public ngOnInit(): void {
    this.webmSrc = `${this.baseSrc}` + VideoExtension.WEBM;
    this.mp4Src = `${this.baseSrc}` + VideoExtension.MP4;

    this.videoStatus$.pipe(untilDestroyed(this)).subscribe((videoStatus: VideoStatus): void => {
      if (!this.videoElement) return;
      this.handleVideoStatusChange(videoStatus);
    });

    this.jumpToTimestamp$.pipe(untilDestroyed(this)).subscribe((timestamp: number): void => {
      if (!this.isJumpToTimestampSupported || !this.videoElement) return;
      this.updateVideoToTimestamp(timestamp);
    });
  }

  public ngAfterViewInit(): void {
    this.addVideoEventListeners();
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ResetVideo());
  }

  private handleVideoStatusChange(newStatus: VideoStatus): void {
    switch (newStatus) {
      case VideoStatus.PLAYING:
        this.playVideo();
        break;
      case VideoStatus.PAUSED:
        this.videoElement.nativeElement.pause();
        break;
      case VideoStatus.STOPPED:
        this.videoElement.nativeElement.pause();
        this.videoElement.nativeElement.currentTime = 0;
        break;
    }
  }

  private playVideo(): void {
    this.document.body.focus(); //For firefox
    const playPromise: Promise<void> = this.videoElement.nativeElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then((): void => {})
        .catch((error): void => {
          console.error("Error playing video: ", error);
          this.store.dispatch(new UpdateVideoStatus(VideoStatus.STOPPED));
        });
    }
  }

  private addVideoEventListeners(): void {
    this.videoElement.nativeElement.addEventListener("ended", this.handleOnEnded.bind(this));
  }

  private updateVideoToTimestamp(timestamp: number): void {
    this.videoElement.nativeElement.currentTime = timestamp;
  }
}
