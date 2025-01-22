import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {CommonModule} from "@angular/common";
import { StartButtonComponent } from '../../start-button/start-button.component'
import { CardComponent } from '../../card/card.component';


@Component({
  selector: 'app-slumpgenerator-location',
  imports: [CommonModule, StartButtonComponent, CardComponent],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SlumpgeneratorLocationComponent {

}

