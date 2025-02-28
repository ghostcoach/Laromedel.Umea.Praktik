import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {LikaLikaLogoComponent} from "./lika-lika-logo/lika-lika-logo.component";
import {PageTitleComponent} from "../shared/page-title/page-title.component";
import {SpsmFooterComponent} from "@ui-components/spsm-footer.component";
import {StartNavComponent} from "./start-nav/start-nav.component";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [LikaLikaLogoComponent, PageTitleComponent, SpsmFooterComponent, StartNavComponent],
  templateUrl: "./start-location.component.html",
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartLocationComponent {}
