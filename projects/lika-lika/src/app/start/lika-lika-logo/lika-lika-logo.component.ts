import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "app-lika-lika-logo",
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img
    src="/assets/layout/home-title.svg"
    class="flex-shrink-0 w-full md:w-3/4 max-w-3xl"
    alt="Logotyp som visar texten Lika=Lika Memory"
    role="presentation"
  />`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class LikaLikaLogoComponent {}
