import {ChangeDetectionStrategy, Component, effect, inject, input, InputSignal} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {MemoryCard} from "@games/memory-card";
import {ICategory} from "../../category/api/category";
import {Store} from "@ngxs/store";
import {CategoryContentStateQueries} from "../../category/state/category-content-state-queries";
import {AddCardToPlayWithAction, RemoveCardToPlayWithAction} from "../../category/state/category-content-state-actions";

@UntilDestroy()
@Component({
  selector: "app-memory-card-table",
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
  templateUrl: "./memory-card-table.component.html",
  styleUrl: "./memory-card-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryCardTableComponent {
  category: InputSignal<ICategory | undefined> = input.required<ICategory | undefined>();

  private store: Store = inject(Store);

  public displayedColumns: string[] = ["select", "ord", "bild", "ritade-tecken", "takk"];
  public dataSource: MatTableDataSource<MemoryCard> = new MatTableDataSource<MemoryCard>([]);
  public selection: SelectionModel<MemoryCard> = new SelectionModel<MemoryCard>(true, []);
  public isAlfabetCategory: boolean = false;

  constructor() {
    effect((): void => {
      const currentCategory: ICategory | undefined = this.category();
      if (currentCategory) {
        this.dataSource.data = [...currentCategory.cards].sort((a, b) => a.word.localeCompare(b.word));

        const selectedWordsSnapshot: string[] = this.store.selectSnapshot(CategoryContentStateQueries.selectedCardWordsByCategory$)(
          currentCategory.name,
        );
        this.initSelectedCards(selectedWordsSnapshot);

        this.isAlfabetCategory = currentCategory.name === "alfabetet";
      }
    });
  }

  private initSelectedCards(selectedWords: string[]): void {
    this.selection.select(...this.dataSource.data.filter((card) => selectedWords.includes(card.word)));
  }

  public isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  public handleCheckboxChange(event: MatCheckboxChange, row: MemoryCard): void {
    const category: ICategory | undefined = this.category();
    if (!category) return;

    if (event.checked) {
      this.selection.select(row);

      this.store.dispatch(new AddCardToPlayWithAction(category, row.word));
    } else {
      this.selection.deselect(row);
      this.store.dispatch(new RemoveCardToPlayWithAction(category, row.word));
    }
  }

  public checkboxLabel(row?: MemoryCard): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.word + 1}`;
  }
}
