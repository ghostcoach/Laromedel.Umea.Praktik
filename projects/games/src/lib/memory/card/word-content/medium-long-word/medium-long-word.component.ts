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
  selector: "lib-medium-long-word",
  standalone: true,
  imports: [NgClass, AsyncPipe, UpperCasePipe],
  templateUrl: "./medium-long-word.component.html",
  styles: `
    span {
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediumLongWordComponent {
  @Input({required: true}) word!: string;

  private readonly store: Store = inject(Store);
  public readonly isUppercaseTextTransform$: Observable<boolean> = this.store.select(MemorySettingsStateQueries.isUpperCaseTextTransform$);
  public readonly numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);
  protected readonly getTextClasses = getTextClasses;

  protected readonly styles: TextStyleMap = {
    "2or4": {
      uppercase:
        "text-xl lg:text-3xl xl:text-4xl 2xl:text-4xl 3xl:text-[2.75m] 4xl:text-[2.75rem] 2xl:narrow-2xl:text-3xl 3xl:narrow-3xl:text-3xl 4xl:narrow-4xl:text-3xl",
      lowercase:
        "text-2xl md:text-2xl lg:text-4xl xl:text-4xl 2xl:text-5xl 3xl:text-5xl narrow-2xl:text-4xl narrow-3xl:text-4xl narrow-4xl:text-4xl",
    },
    "6": {
      uppercase:
        "text-md md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-[2.5rem] 4xl:text-[2.5rem] narrow-3xl:text-4xl narrow-4xl:text-4xl",
      lowercase:
        "text-lg md:text-xl lg:text-3xl xl:text-4xl 2xl:text-4xl 3xl:text-5xl 4xl:text-5xl narrow-3xl:text-4xl narrow-4xl:text-4xl",
    },
    "8": {
      uppercase:
        "text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-[1.65rem] 3xl:text-3xl 4xl:text-4xl narrow-3xl:text-3xl narrow-4xl:text-3xl",
      lowercase:
        "text-md md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-4xl 4xl:text-5xl narrow-3xl:text-4xl narrow-4xl:text-4xl",
    },
    "10or12": {
      uppercase:
        "text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-3xl narrow-xl:text-xl narrow-2xl:text-2xl narrow-3xl:text-xl narrow-4xl:text-2xl",
      lowercase:
        "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-4xl 4xl:text-4xl narrow-xl:text-2xl narrow-2xl:text-2xl narrow-3xl:text-3xl narrow-4xl:text-3xl",
    },
    "14or16": {
      uppercase:
        "text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-2xl 4xl:text-3xl narrow-lg:text-md narrow-xl:text-lg narrow-2xl:text-lg narrow-3xl:text-xl narrow-4xl:text-xl",
      lowercase:
        "text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl 3xl:text-3xl 4xl:text-4xl narrow-lg:text-xl narrow-xl:text-lg narrow-2xl:text-2xl narrow-3xl:text-2xl narrow-4xl:text-2xl",
    },
  };
}
