import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@UntilDestroy()
@Component({
  selector: "app-info-button",
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: "./info-button.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoButtonComponent {}
