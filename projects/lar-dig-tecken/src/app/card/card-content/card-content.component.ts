import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-card-content',
  imports: [CommonModule],
  templateUrl: './card-content.component.html',
  styleUrl: './card-content.component.scss'
})
export class CardContentComponent {
@ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>; // Reference to the video element
// Inputs to determine the content of the card from parent component
@Input() content!: string;
@Input() contentMedium!: string;
@Input() word!: string;
@Input() category!: string;

// Function to play the video
playVideo(): void {
  if (this.videoElement) {
    this.videoElement.nativeElement.load();
    this.videoElement.nativeElement.play().catch(error => console.error('Error playing video:', error));
  }
}


}