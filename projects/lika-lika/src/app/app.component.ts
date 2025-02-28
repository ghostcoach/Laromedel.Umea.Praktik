import {Component, inject, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {ApplicationService} from "@utility/application.service";
import {Store} from "@ngxs/store";
import {LoadCategoryContent} from "./category/state/category-content-state-actions";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  private applicationService: ApplicationService = inject(ApplicationService);
  private store: Store = inject(Store);

  public ngOnInit(): void {
    this.applicationService.checkMediaSupport();
    this.store.dispatch(new LoadCategoryContent());
  }
}
