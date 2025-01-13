import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: "app-root",
    imports: [RouterOutlet],
    templateUrl: "./app.component.html"
})
export class AppComponent {}
