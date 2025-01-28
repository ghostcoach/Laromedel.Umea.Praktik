import {ChangeDetectionStrategy, Component, inject, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AsyncPipe, NgClass, NgForOf} from "@angular/common";
import {CardComponent} from "../card/card.component";
import {Observable} from "rxjs";
import {SettingsStateQueries} from "../../settings/state/settings-state-queries";
import {Store} from "@ngxs/store";
import {MemoryCard} from "@games/memory-card";
import {MemoryGameQueries} from "@games/memory-game-queries";
import {ICategory} from "../../category/api/category";

@UntilDestroy()
@Component({
  selector: "app-board",
  standalone: true,
  imports: [AsyncPipe, CardComponent, NgForOf, NgClass],
  templateUrl: "./board.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  @Input() public category: ICategory;

  public store: Store = inject(Store);
  public playingDeck$: Observable<MemoryCard[]> = this.store.select(MemoryGameQueries.playingDeck$);
  public numberOfCards$: Observable<number> = this.store.select(SettingsStateQueries.numberOfCards$);
}
