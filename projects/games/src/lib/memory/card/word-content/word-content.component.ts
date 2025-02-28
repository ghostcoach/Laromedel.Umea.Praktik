import {ChangeDetectionStrategy, Component, inject, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {MemorySettingsStateQueries} from "../../state/memory-settings-state-queries";
import {LongWordComponent} from "./long-word/long-word.component";
import {MediumLongWordComponent} from "./medium-long-word/medium-long-word.component";
import {SingleLetterComponent} from "./single-letter/single-letter.component";
import {WordComponent} from "./word/word.component";

@UntilDestroy()
@Component({
  selector: "lib-word-content",
  standalone: true,
  imports: [LongWordComponent, MediumLongWordComponent, SingleLetterComponent, WordComponent],
  templateUrl: "./word-content.component.html",
  styleUrls: ["./word-content.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordContentComponent {
  @Input({required: true}) word: string;
  @Input() isSingleLetter: boolean = false;
  private readonly MEDIUM_LONG_WORD_LOWER_LIMIT: number = 10;
  private readonly LONG_WORD_LOWER_LIMIT: number = 13;
  private store: Store = inject(Store);

  public numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);

  public isMediumLongWord(): boolean {
    return this.word.length >= this.MEDIUM_LONG_WORD_LOWER_LIMIT && this.word.length < this.LONG_WORD_LOWER_LIMIT;
  }

  public isLongWord(): boolean {
    return this.word.length >= this.MEDIUM_LONG_WORD_LOWER_LIMIT;
  }
}
