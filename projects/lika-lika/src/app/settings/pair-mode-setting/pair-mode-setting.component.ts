import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AsyncPipe, NgForOf} from "@angular/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MemorySettingsStateQueries} from "@games/memory-settings-state-queries";
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {UpdatePairingModeFirstCard, UpdatePairingModeSecondCard} from "@games/memory-settings-state-actions";
import {CardContent} from "@games/card-content";
import {FormsModule} from "@angular/forms";

@UntilDestroy()
@Component({
  selector: "app-pair-mode-setting",
  standalone: true,
  imports: [AsyncPipe, NgForOf, FormsModule],
  templateUrl: "./pair-mode-setting.component.html",
  styleUrl: "./pair-mode-setting.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PairModeSettingComponent {
  public firstCard$: Observable<string> = this.store.select(MemorySettingsStateQueries.pairingModeFirstCard$);
  public secondCard$: Observable<string> = this.store.select(MemorySettingsStateQueries.pairingModeSecondCard$);
  public cardContents: CardContent[] = Object.values(CardContent);

  constructor(private store: Store) {}

  public handleFirstCardChange(cardContent: CardContent): void {
    this.store.dispatch(new UpdatePairingModeFirstCard(cardContent));
  }

  public handleSecondCardChange(cardContent: CardContent): void {
    this.store.dispatch(new UpdatePairingModeSecondCard(cardContent));
  }
}
