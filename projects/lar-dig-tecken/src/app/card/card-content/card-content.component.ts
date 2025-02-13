import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-card-content',
  imports: [CommonModule],
  templateUrl: './card-content.component.html',
  styleUrl: './card-content.component.scss'
})
export class CardContentComponent  {
@Input() pairingMode!: string;
@Input() data!: string;
@Input() category!: string;
@ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

playVideo(): void {
  if (this.videoElement) {
    this.videoElement.nativeElement.load();
    this.videoElement.nativeElement.play().catch(error => console.error('Error playing video:', error));
  }
}

}