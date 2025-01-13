import { Component, inject } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Observable } from "rxjs";
import { SubtitleQueries } from "../state/subtitle-queries";
import { Store } from "@ngxs/store";
import { ISubtitleText } from "../api/subtitle-text";
import { AsyncPipe, NgIf } from "@angular/common";

@UntilDestroy()
@Component({
    selector: "lib-subtitle",
    imports: [AsyncPipe, NgIf],
    templateUrl: "./subtitle.component.html",
    styleUrl: "./subtitle.component.css"
})
export class SubtitleComponent {
  public subtitleText$: Observable<ISubtitleText> = inject(Store).select(
    SubtitleQueries.subtitleText$,
  );
  public isSubtitleHidden$: Observable<boolean> = inject(Store).select(
    SubtitleQueries.isSubtitleHidden$,
  );

  public showSecondSubtitleRow$: Observable<boolean> = inject(Store).select(
    SubtitleQueries.showSecondSubtitleRow$,
  );
}
