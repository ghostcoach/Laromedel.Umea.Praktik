import { Component, Input } from '@angular/core';
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


}