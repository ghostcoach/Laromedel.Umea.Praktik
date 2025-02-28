import {Component, inject, Input} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AsyncPipe, NgClass} from "@angular/common";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {CardComponent} from "../card/card.component";
import {MemoryCard} from "../api/memory-card";
import {MemoryGameQueries} from "../state/memory-game-queries";
import {MemorySettingsStateQueries} from "../state/memory-settings-state-queries";
import {StyleMap} from "@utility/style-map";
import {getStyleClassesForAllCardSizes} from "../card/card-util";

@UntilDestroy()
@Component({
  selector: "lib-board",
  standalone: true,
  imports: [AsyncPipe, CardComponent, NgClass],
  templateUrl: "./board.component.html",
})
export class BoardComponent {
  @Input({required: true}) public cardBackImage: string;
  @Input({required: true}) public cardFrontImage: string;

  public store: Store = inject(Store);
  public playingDeck$: Observable<MemoryCard[]> = this.store.select(MemoryGameQueries.playingDeck$);
  public numberOfCards$: Observable<number> = this.store.select(MemorySettingsStateQueries.numberOfCards$);

  protected readonly styles: StyleMap = {
    "2": "grid-cols-2 2xl:gap-20 portrait:grid-cols-1 portrait:lg:grid-cols-2",
    "4": "[grid-template-columns:repeat(2,fit-content(100%))] portrait-mobile:gap-8 landscape-mobile:gap-8 2xl:gap-32 3xl:gap-36 narrow-2xl:gap-24 narrow-3xl:gap-28",
    "6": "[grid-template-columns:repeat(3,fit-content(100%))] portrait:grid-cols-2 xl:gap-14 2xl:gap-24 3xl:gap-28 2xl:narrow-2xl:gap-18 3xl:narrow-3xl:gap-18",
    "8": "[grid-template-columns:repeat(4,fit-content(100%))] portrait:grid-cols-2 lg:gap-8 xl:gap-10 2xl:gap-16 3xl:gap-20 2xl:narrow-2xl:gap-12 3xl:narrow-3xl:gap-14",
    "10": "[grid-template-columns:repeat(4,fit-content(100%))] portrait:grid-cols-3 lg:gap-6 xl:gap-8 2xl:gap-12 3xl:gap-16 2xl:narrow-2xl:gap-7 3xl:narrow-3xl:gap-7 4xl:narrow-4xl:gap-7",
    "12": "[grid-template-columns:repeat(4,fit-content(100%))] portrait:grid-cols-3 lg:gap-6 xl:gap-8 2xl:gap-12 3xl:gap-16 2xl:narrow-2xl:gap-7 3xl:narrow-3xl:gap-7 4xl:narrow-4xl:gap-7",
    "14": "[grid-template-columns:repeat(4,fit-content(100%))] portrait:grid-cols-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10 2xl:narrow-2xl:gap-4 3xl:narrow-3xl:gap-4 4xl:narrow-4xl:gap-4",
    "16": "[grid-template-columns:repeat(4,fit-content(100%))] portrait:grid-cols-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10 2xl:narrow-2xl:gap-4 3xl:narrow-3xl:gap-4 4xl:narrow-4xl:gap-4",
  };
  protected readonly getStyleClassesForAllCardSizes = getStyleClassesForAllCardSizes;
}
