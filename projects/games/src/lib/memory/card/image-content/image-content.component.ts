import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {ImageSourceType} from "@media/image-source-type";

@UntilDestroy()
@Component({
  selector: "lib-image-content",
  standalone: true,
  imports: [],
  templateUrl: "./image-content.component.html",
  styleUrls: ["./image-content.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageContentComponent {
  @Input({required: true}) public webpSrc: string;
  @Input({required: true}) public fallbackSrc: string;
  @Input({required: true}) public fallbackSourceType: ImageSourceType;
  @Input({required: true}) public alt: string;
}
