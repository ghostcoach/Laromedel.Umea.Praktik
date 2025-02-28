import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from "@angular/core";
import {NgIf} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {ImageSourceType} from "@media/image-source-type";
import {ImageContentComponent} from "../image-content/image-content.component";
import {WordContentComponent} from "../word-content/word-content.component";
import {MemoryCard} from "../../api/memory-card";
import {CardContent} from "../../api/card-content";
import {VideoContentComponent} from "../video-content/video-content.component";

@UntilDestroy()
@Component({
  selector: "lib-card-front",
  standalone: true,
  imports: [WordContentComponent, NgIf, ImageContentComponent, VideoContentComponent],
  templateUrl: "./card-front.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardFrontComponent implements OnInit {
  @Input({required: true}) public memoryCard!: MemoryCard;
  @Input({required: true}) public cardFrontImage!: string;
  @Input() public cardContentOverride: CardContent | undefined;

  @ViewChild("videoContent", {static: false})
  public videoContentComponent!: VideoContentComponent;

  public imageSourceTypeEnum: typeof ImageSourceType = ImageSourceType;

  public ngOnInit(): void {
    if (!this.cardContentOverride) return;

    this.memoryCard.cardContent = this.cardContentOverride;
  }

  public playVideo(): void {
    this.videoContentComponent.playVideo();
  }
}
