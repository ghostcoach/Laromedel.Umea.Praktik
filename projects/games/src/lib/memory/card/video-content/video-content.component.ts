import {ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "lib-video-content",
  standalone: true,
  imports: [],
  templateUrl: "./video-content.component.html",
  styleUrl: "./video-content.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoContentComponent {
  @Input() videoMP4: string;

  @ViewChild("cardVideo") public cardVideo: ElementRef<HTMLVideoElement>;

  public playVideo(): void {
    if (!this.cardVideo) return;

    this.cardVideo.nativeElement.play().then((): void => {
      // Do nothing
    });
  }
}
