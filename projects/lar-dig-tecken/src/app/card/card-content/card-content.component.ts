import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CardStates } from '../state/card.state';
import { ICardFullStateModel } from '../state/api/card-interface';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-card-content',
  imports: [CommonModule],
  templateUrl: './card-content.component.html',
  styleUrl: './card-content.component.scss'
})
export class CardContentComponent implements OnChanges  {
// @Input() pairingMode!: string;
// @Input() data!: string;
// @Input() category!: string;
@ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
@Input() content!: string;
@Input() contentMedium!: string;
@Input() word!: string;

// word: string = '';
// content: string = '';
// contentMedium: string = '';


playVideo(): void {
  if (this.videoElement) {
    this.videoElement.nativeElement.load();
    this.videoElement.nativeElement.play().catch(error => console.error('Error playing video:', error));
  }
}

ngOnChanges(changes: SimpleChanges): void {
  // console.log('data in card-content:', this.data);

}


}