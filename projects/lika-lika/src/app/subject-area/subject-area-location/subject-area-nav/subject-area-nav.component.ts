import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {AsyncPipe, NgForOf} from "@angular/common";
import {CardLinkComponent} from "../../../shared/card-link/card-link.component";
import {Observable} from "rxjs";
import {ICategoryViewModel} from "../../../category/api/category-view-model";
import {SubjectAreaStateQueries} from "../../state/subject-area-state-queries";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";

@UntilDestroy()
@Component({
  selector: "app-subject-area-nav",
  standalone: true,
  imports: [AsyncPipe, CardLinkComponent, NgForOf],
  templateUrl: "./subject-area-nav.component.html",
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectAreaNavComponent {
  private store: Store = inject(Store);
  public categories$: Observable<ICategoryViewModel[]> = this.store.select(SubjectAreaStateQueries.categories$);
}
