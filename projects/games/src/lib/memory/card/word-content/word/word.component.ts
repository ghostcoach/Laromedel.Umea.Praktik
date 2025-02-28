import {ChangeDetectionStrategy, Component, inject, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Observable} from "rxjs";
import {MemorySettingsStateQueries} from "../../../state/memory-settings-state-queries";
import {Store} from "@ngxs/store";
import {TextStyleMap} from "@utility/text-style-map";
import {getTextClasses} from "../../card-util";
import {AsyncPipe, NgClass, UpperCasePipe} from "@angular/common";

@UntilDestroy()
@Component({
  selector: "lib-word",
  standalone: true,
  imports: [NgClass, AsyncPipe, UpperCasePipe],
  templateUrl: "./word.component.html",
  styles: `
    span {
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordComponent {
  @Input({required: true}) word!: string;

  private readonly store: Store = inject(Store);
  public readonly isUppercaseTextTransform$: Observable<boolean> = this.store.select(MemorySettingsStateQueries.isUpperCaseTextTransform$);
  public readonly numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);
  protected readonly getTextClasses = getTextClasses;

  protected readonly styles: TextStyleMap = {
    "2or4": {
      uppercase:
        "text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-5xl 4xl:text-6xl narrow-3xl:text-4xl narrow-4xl:text-4xl",
      lowercase: "text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl 4xl:text-7xl narrow-3xl:text-6xl 4xl:narrow-4xl:text-6xl",
    },
    "6": {
      uppercase:
        "text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-5xl 4xl:text-6xl narrow-3xl:text-5xl narrow-4xl:text-5xl",
      lowercase:
        "text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-6xl 4xl:text-7xl narrow-3xl:text-5xl narrow-4xl:text-5xl",
    },
    "8": {
      uppercase:
        "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl narrow-3xl:text-4xl narrow-4xl:text-4xl",
      lowercase:
        "text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl narrow-3xl:text-5xl narrow-4xl:text-5xl",
    },
    "10or12": {
      uppercase:
        "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-3xl 3xl:text-5xl 4xl:text-6xl narrow-3xl:text-3xl narrow-4xl:text-4xl",
      lowercase:
        "text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-5xl 4xl:text-6xl narrow-3xl:text-4xl narrow-4xl:text-4xl",
    },
    "14or16": {
      uppercase: "text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-2xl 3xl:text-3xl 4xl:3xl narrow-3xl:text-2xl narrow-4xl:text-3xl",
      lowercase:
        "text-lg md:text-xl lg:text-3xl xl:text-4xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl 3xl:narrow-3xl:text-3xl narrow-4xl:text-3xl",
    },
  };
}
