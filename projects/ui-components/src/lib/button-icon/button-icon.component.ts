import { Component, Input } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "lib-button-icon",
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: "./button-icon.component.html",
  styleUrl: "./button-icon.component.scss",
})
export class ButtonIconComponent {
  @Input() src: string;
  @Input() alt: string;
  @Input() width: number;
  @Input() height: number;
  @Input() className: string = "";

  public get srcSet(): string {
    return `${this.src} 320w,${this.src} 240w, ${this.src} 160w`;
  }
}
