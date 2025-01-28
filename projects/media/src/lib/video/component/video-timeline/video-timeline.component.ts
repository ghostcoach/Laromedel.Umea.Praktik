import {AfterContentInit, Component, ElementRef, Inject, Input, Renderer2, ViewChild} from "@angular/core";
import {CdkDrag, CdkDragEnd, CdkDragMove} from "@angular/cdk/drag-drop";
import {DatePipe, DOCUMENT} from "@angular/common";
import {Store} from "@ngxs/store";
import {PauseVideo, PlayVideo} from "../../state/video-state-actions";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {fromEvent} from "rxjs";

@Component({
  selector: "lib-video-timeline",
  standalone: true,
  imports: [CdkDrag, DatePipe],
  templateUrl: "./video-timeline.component.html",
  styleUrl: "./video-timeline.component.scss",
})
@UntilDestroy()
export class VideoTimelineComponent implements AfterContentInit {
  @Input() public videoElementId!: string;

  @ViewChild("timeLineElement") timeLineElement!: ElementRef;
  @ViewChild("progressUnderlayElement") progressUnderlayElement!: ElementRef;
  @ViewChild("progressLineElement") progressLineElement!: ElementRef;
  @ViewChild("chapterMarkElement") chapterMarkElement!: ElementRef;

  public currentVideoElement!: HTMLVideoElement;
  public showTimeBall: boolean = false;
  public isTimeBallMoving!: boolean;
  public progressLineWidth!: number;
  public progressUnderlayWidth!: number;
  public timestampMilliseconds: number = 0;
  public isDragging: boolean = false;

  private wasVideoPlaying: boolean = false;
  private isJumping: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private store: Store,
  ) {
    this.progressLineWidth = 10;
    this.progressUnderlayWidth = 0;
  }

  ngAfterContentInit(): void {
    this.initVideoElement();

    setTimeout((): void => {
      this.initEventListeners();
      this.initKeyboardControls();
    }, 100);
  }

  public timeLineMouseEnter(): void {
    this.showTimeBall = true;
  }

  public timeLineMouseLeave(): void {
    if (this.isTimeBallMoving) return;
    this.showTimeBall = false;
  }

  public timeLineMouseDown($event: Event): void {
    const target: HTMLElement = $event.target as HTMLElement;

    if (target.className === "progress-circle") return;

    //TODO: dispatch reset sub tittle

    this.wasVideoPlaying = !this.currentVideoElement.paused;

    this.moveProgressLineToClickPosition($event, target.className === "chapter-mark" || target.className === "chapter-desc");
    this.validateProgressBounds();
    this.updateProgressUnderlayWidth();
  }

  public timeLineMouseUp(): void {
    this.isJumping = false;

    if (!this.wasVideoPlaying) return;

    //TODO: play video should take id to support multiple videos
    this.store.dispatch(new PlayVideo());
  }

  public progressLineDragStarted(): void {
    this.isDragging = true;
    this.wasVideoPlaying = !this.currentVideoElement.paused;
    this.currentVideoElement.pause();
  }

  public progressLineDragMoved($event: CdkDragMove): void {
    const distanceTravelled: number = $event.distance.x + this.getLeftStyleValue();

    console.log("Distance:" + distanceTravelled);

    const distanceChangeAsPercentage: number = this.getDistanceTravelAsPercentage(
      distanceTravelled,
      this.progressLineElement.nativeElement.offsetWidth,
      this.timeLineElement.nativeElement.offsetWidth,
    );

    this.validateProgressBounds(this.getLeftStyleValue());

    this.updateProgressUnderlayWidth();

    if (!this.validateOuterTimeBounds(distanceChangeAsPercentage)) return;

    this.currentVideoElement.currentTime = this.currentVideoElement.duration * distanceChangeAsPercentage;
  }

  public progressLineDragEnded($event: CdkDragEnd): void {
    const totalTranslateXValue: number = this.parseTranslate3dValue(this.progressLineElement.nativeElement.style.transform);

    this.progressLineElement.nativeElement.style.left = `${totalTranslateXValue + this.getLeftStyleValue()}px`;

    $event.source.reset();

    this.isDragging = false;

    if (!this.wasVideoPlaying) return;

    this.store.dispatch(new PlayVideo());
  }

  private initKeyboardControls(): void {
    fromEvent<KeyboardEvent>(document, "keydown")
      .pipe(untilDestroyed(this))
      .subscribe((event: KeyboardEvent) => {
        if (!this.currentVideoElement) return;

        switch (event.code) {
          case "Space":
            event.preventDefault();
            this.currentVideoElement.paused ? this.store.dispatch(new PlayVideo()) : this.store.dispatch(new PauseVideo());
            break;
          case "ArrowRight":
            this.currentVideoElement.currentTime += 5;
            break;
          case "ArrowLeft":
            this.currentVideoElement.currentTime -= 5;
            break;
        }
      });
  }

  private moveProgressLineDuringPlay(): void {
    if (!this.timeLineElement || this.isDragging || this.isJumping) return;

    const currentTimeAsPercentageOfTotalTime: number = this.currentVideoElement.currentTime / this.currentVideoElement.duration;

    const distanceOnTimeLine: number = this.timeLineElement.nativeElement.offsetWidth * currentTimeAsPercentageOfTotalTime;

    this.progressLineElement.nativeElement.style.transform = `translate3d(0px, 0px, 0px)`;
    this.progressLineElement.nativeElement.style.left = `${distanceOnTimeLine}px`;

    this.validateProgressBounds();
  }

  private moveProgressLineToClickPosition($event: Event, isChapterJump: boolean = false): void {
    if (this.isDragging) return;

    this.isJumping = true;

    const offsetX: number = $event instanceof TouchEvent ? this.getOffsetXValue($event) : ($event as MouseEvent).offsetX;

    const distanceOnTimeLine: number = !isChapterJump
      ? offsetX - this.progressLineElement.nativeElement.offsetWidth
      : this.chapterMarkElement.nativeElement.offsetLeft - this.progressLineElement.nativeElement.offsetWidth;

    this.progressLineElement.nativeElement.style.left = `${distanceOnTimeLine}px`;

    const distanceChangeAsPercentage: number = this.getDistanceTravelAsPercentage(
      distanceOnTimeLine,
      this.progressLineElement.nativeElement.offsetWidth,
      this.timeLineElement.nativeElement.offsetWidth,
    );

    if (!this.validateOuterTimeBounds(distanceChangeAsPercentage)) return;

    this.currentVideoElement.currentTime = this.currentVideoElement.duration * distanceChangeAsPercentage;
  }

  private updateProgressUnderlayWidth(): void {
    if (!this.progressLineElement) return;

    const totalTranslateXValue: number = this.parseTranslate3dValue(this.progressLineElement.nativeElement.style.transform);

    this.progressUnderlayWidth = totalTranslateXValue + this.getLeftStyleValue() + this.progressLineElement.nativeElement.offsetWidth;

    //Set width of progress underlay using renderer
    this.renderer.setStyle(this.progressUnderlayElement.nativeElement, "width", `${this.progressUnderlayWidth}px`);
  }

  private getDistanceTravelAsPercentage(distance: number, progressCircleWidth: number, totalLength: number): number {
    return (distance + progressCircleWidth) / totalLength;
  }

  private parseTranslate3dValue(translate3dValue: string): number {
    const numberOfTranslate3d: number = (translate3dValue.match(/translate3d/g) || []).length;

    const translate3dValueArray: string[] = translate3dValue.split(",");
    const translate3dValueX: string = translate3dValueArray[0].split("(")[1];
    const primaryValue: number = this.convertPxStringToNumber(translate3dValueX);

    if (numberOfTranslate3d > 1) {
      const secondTranslate3dValueX: string = translate3dValueArray[2].split("(")[1];
      const secondaryValue: number = this.convertPxStringToNumber(secondTranslate3dValueX);

      return primaryValue + secondaryValue;
    }

    return primaryValue;
  }

  private convertPxStringToNumber = (pixelString: string): number => (pixelString === undefined ? 0 : Number(pixelString.split("px")[0]));

  private getLeftStyleValue = (): number => this.convertPxStringToNumber(this.progressLineElement.nativeElement.style.left);

  private validateProgressBounds(leftStyle: number = 0): void {
    const distance: number = this.parseTranslate3dValue(this.progressLineElement.nativeElement.style.transform) + leftStyle;

    if (distance < 0) {
      this.progressLineElement.nativeElement.removeAttribute("style");
    }

    if (distance > this.timeLineElement.nativeElement.offsetWidth) {
      this.progressLineElement.nativeElement.style.left = `${this.timeLineElement.nativeElement.offsetWidth}px`;
    }
  }

  private initEventListeners(): void {
    this.currentVideoElement.addEventListener("timeupdate", (): void => {
      setInterval((): void => {
        this.moveProgressLineDuringPlay();
        this.updateProgressUnderlayWidth();
        this.timestampMilliseconds = this.currentVideoElement.currentTime * 1000;
      }, 100);
    });
  }

  private initVideoElement(): void {
    const videoElement: HTMLVideoElement = this.document.getElementById(this.videoElementId) as HTMLVideoElement;

    if (!videoElement) return;

    this.currentVideoElement = videoElement;
  }

  private validateOuterTimeBounds(changePercentage: number): boolean {
    if (changePercentage < 99) return true;

    this.currentVideoElement.currentTime = this.currentVideoElement.duration;

    return false;
  }

  private getOffsetXValue(event: TouchEvent): number {
    const targetElement: HTMLElement = event.target as HTMLElement;
    const rect: DOMRect = targetElement.getBoundingClientRect();
    const bodyRect: DOMRect = document.body.getBoundingClientRect();
    return event.changedTouches[0].pageX - (rect.left - bodyRect.left);
  }
}
