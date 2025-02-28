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
  selector: "lib-long-word",
  standalone: true,
  imports: [NgClass, AsyncPipe, UpperCasePipe],
  templateUrl: "./long-word.component.html",
  styles: `
    span {
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongWordComponent {
  @Input({required: true}) word!: string;

  private readonly store: Store = inject(Store);
  public readonly isUppercaseTextTransform$: Observable<boolean> = this.store.select(MemorySettingsStateQueries.isUpperCaseTextTransform$);
  public readonly numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);
  protected readonly getTextClasses = getTextClasses;

  protected readonly styles: TextStyleMap = {
    "2or4": {
      uppercase:
        "text-md lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-[2rem] 4xl:text-[2rem] 2xl:narrow-2xl:text-2xl 3xl:narrow-3xl:text-2xl 4xl:narrow-4xl:text-2xl",
      lowercase:
        "text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-4xl narrow-lg:text-xl narrow-2xl:text-3xl narrow-3xl:text-3xl narrow-4xl:text-3xl",
    },
    "6": {
      uppercase:
        "text-sm  lg:text-lg xl:text-2xl 2xl:text-2xl 3xl:text-[2rem] 4xl:text-[2rem] narrow-2xl:text-2xl narrow-3xl:text-2xl narrow-4xl:text-2xl",
      lowercase: "text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl 3xl:text-4xl 4xl:text-4xl narrow-3xl:text-3xl narrow-4xl:text-3xl",
    },
    "8": {
      uppercase: "text-xs lg:text-md xl:text-lg 2xl:text-[1.4rem] 3xl:text-2xl 4xl:text-3xl narrow-3xl:text-xl narrow-4xl:text-xl",
      lowercase:
        "text-xs md:text-sm lg:text-xl xl:text-xl 2xl:text-[1.75rem] 3xl:text-3xl 4xl:text-4xl narrow-3xl:text-2xl narrow-4xl:text-2xl",
    },
    "10or12": {
      uppercase:
        "text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-2xl 4xl:text-2xl narrow-lg:text-base narrow-xl:text-md narrow-2xl:text-md narrow-3xl:text-md narrow-4xl:text-md",
      lowercase:
        "text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-3xl narrow-xl:text-xl narrow-2xl:text-xl narrow-3xl:text-2xl narrow-4xl:text-2xl",
    },
    "14or16": {
      uppercase:
        "text-[9px] md:text-xs lg:text-sm xl:text-md 2xl:text-lg 3xl:text-xl 4xl:text-2xl narrow-lg:text-sm narrow-xl:text-md narrow-2xl:text-md narrow-3xl:text-md narrow-4xl:text-md",
      lowercase:
        "text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-2xl 4xl:text-3xl narrow-lg:text-lg narrow-xl:text-lg narrow-2xl:text-lg narrow-3xl:text-lg narrow-4xl:text-lg",
    },
  };
}
