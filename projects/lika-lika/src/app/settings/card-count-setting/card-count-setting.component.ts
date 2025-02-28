import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgClass, NgForOf} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {UpdateNumberOfCards} from "@games/memory-settings-state-actions";
import {CardCount} from "@games/card-count";
import {Observable} from "rxjs";
import {MemorySettingsStateQueries} from "@games/memory-settings-state-queries";

@UntilDestroy()
@Component({
  selector: "app-card-count-setting",
  standalone: true,
  imports: [FormsModule, NgForOf, AsyncPipe, NgClass],
  templateUrl: "./card-count-setting.component.html",
  styleUrl: "./card-count-setting.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCountSettingComponent {
  public cardNumbers: number[] = Object.values(CardCount).filter((value): boolean => typeof value === "number") as number[];
  public numberOfCards$: Observable<CardCount> = this.store.select(MemorySettingsStateQueries.numberOfCards$);

  constructor(private store: Store) {}

  public handleCardSelectionChange(value: number): void {
    this.store.dispatch(new UpdateNumberOfCards(value));
  }
}
