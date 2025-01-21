import {Component, Input} from "@angular/core";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: "lib-spsm-footer",
  standalone: true,
  imports: [NgOptimizedImage, MatIconModule, NgIf],
  templateUrl: "./spsm-footer.component.html",
  styleUrl: "./spsm-footer.component.scss",
})
export class SpsmFooterComponent {
  @Input() isSpsmBlue: boolean = false;
  @Input() isMobile: boolean = false;
  @Input() isUnderline: boolean = true;
  @Input() isFullWidth: boolean = false;

  public get spsmLogo(): string {
    return this.isSpsmBlue ? "/assets/spsm-logo-white.svg" : "/assets/spsm-logo-black.svg";
  }

  public openSpsmWebpage(): void {
    window.open("https://www.spsm.se", "_blank");
  }

  public scrollToTop(): void {
    window.scrollTo({top: 0, behavior: "smooth"});
  }
}
