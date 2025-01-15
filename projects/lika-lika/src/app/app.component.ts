import {Component, inject, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {ApplicationService} from "@utility/application.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  private applicationService: ApplicationService = inject(ApplicationService);

  public ngOnInit(): void {
    this.applicationService.checkMediaSupport();
  }
}
