import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {CommonModule} from "@angular/common";
import { StartButtonComponent } from '../../start-button/start-button.component'


@Component({
  selector: 'app-slumpgenerator-location',
  imports: [CommonModule, StartButtonComponent],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SlumpgeneratorLocationComponent {

}

