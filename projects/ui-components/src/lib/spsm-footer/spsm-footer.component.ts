import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild} from "@angular/core";
import {NgClass, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: "lib-spsm-footer",
  standalone: true,
  imports: [MatIconModule, NgIf, NgClass],
  templateUrl: "./spsm-footer.component.html",
  styleUrl: "./spsm-footer.component.scss",
})
export class SpsmFooterComponent implements AfterViewInit {
  @Input() isSpsmBlue: boolean = false;
  @Input() isSpsmRed: boolean = false;
  @Input() isMobile: boolean = false;
  @Input() isUnderline: boolean = true;
  @Input() isFullWidth: boolean = false;
  @Input() bgColor: string = "";
  @Input() isWhiteText: boolean = false;
  @Input() topBorder: boolean = false;

  @ViewChild("footer") footer: ElementRef;

  constructor(private renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    this.updateBackgroundColor();
  }

  private updateBackgroundColor(): void {
    if (this.bgColor === "") {
      this.bgColor = "#fff";
    }

    this.renderer.setStyle(this.footer.nativeElement, "background-color", this.bgColor);
  }

  public get spsmLogo(): string {
    return this.isSpsmBlue || this.isWhiteText ? "/assets/spsm-logo-white.svg" : "/assets/spsm-logo-black.svg";
  }

  public openSpsmWebpage(): void {
    window.open("https://www.spsm.se", "_blank");
  }

  public scrollToTop(): void {
    window.scrollTo({top: 0, behavior: "smooth"});
  }
}
