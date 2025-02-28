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
  selector: "lib-single-letter",
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe, NgClass],
  templateUrl: "./single-letter.component.html",
  styles: `
    span {
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleLetterComponent {
  @Input({required: true}) letter!: string;

  private readonly store: Store = inject(Store);
  public readonly isUppercaseTextTransform$: Observable<boolean> = this.store.select(MemorySettingsStateQueries.isUpperCaseTextTransform$);
  public readonly numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);
  protected readonly getTextClasses = getTextClasses;

  public readonly styles: TextStyleMap = {
    "2or4": {
      uppercase:
        "text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl 3xl:text-[10rem] 4xl:text-[11rem] narrow-3xl:text-[8rem] narrow-4xl:text-[9rem]",
      lowercase:
        "text-5xl md:text-6xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] 3xl:text-[11rem] 4xl:text-[12rem] narrow-3xl:text-[9rem] narrow-4xl:text-[9.5rem]",
    },
    "6": {
      uppercase:
        "text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-[9rem] 4xl:text-[10rem] narrow-3xl:text-[7rem] narrow-4xl:text-[8rem]",
      lowercase:
        "text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl 3xl:text-[10rem] 4xl:text-[11rem] narrow-3xl:text-[8rem] narrow-4xl:text-[9rem]",
    },
    "8": {
      uppercase:
        "text-2xl md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl narrow-3xl:text-[6rem] narrow-4xl:text-[6.5rem]",
      lowercase:
        "text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem] narrow-3xl:text-[7rem] narrow-4xl:text-[7rem]",
    },
    "10or12": {
      uppercase:
        "text-2xl md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl narrow-3xl:text-[6rem] narrow-4xl:text-[6.5rem]",
      lowercase:
        "text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem] narrow-3xl:text-[7rem] narrow-4xl:text-[7rem]",
    },
    "14or16": {
      uppercase:
        "text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-8xl narrow-3xl:text-[5rem] narrow-4xl:text-[5.5rem]",
      lowercase:
        "text-2xl md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl narrow-3xl:text-[6rem] narrow-4xl:text-[6rem]",
    },
  };
}
