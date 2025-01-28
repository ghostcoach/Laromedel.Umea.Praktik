import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-card-content',
  imports: [CommonModule],
  templateUrl: './card-content.component.html',
  styleUrl: './card-content.component.scss'
})
export class CardContentComponent implements OnChanges {
@Input() pairingMode!: string;
@Input() data!: string;
@Input() category!: string;

// displayedData!: string;

ngOnChanges(changes: SimpleChanges): void {
  if (changes['data'] || changes['pairingMode']) {
    console.log(this.data);
    
  }
}

// // Update the displayed data based on the pairing mode
// updateDisplayedData(): void {
//   if (this.pairingMode === 'ord') {
//     this.displayedData = this.data; // Plain text
//     console.log('displayed data:',this.displayedData);
    
//   } else if (this.pairingMode === 'bild') {
//     this.displayedData = `/assets/images/${this.data}.png`; // Image path
//   } else if (this.pairingMode === 'ritade tecken') {
//     this.displayedData = `/assets/drawings/${this.data}.png`; // Drawing path
//   } else if (this.pairingMode === 'tecken som stöd') {
//     this.displayedData = `/assets/videos/${this.data}.mp4`; // Video path
//   } else {
//     this.displayedData = 'No data available'; // Fallback
//   }
// }
}
