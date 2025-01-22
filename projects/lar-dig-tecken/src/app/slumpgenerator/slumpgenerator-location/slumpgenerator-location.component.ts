import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {NgForOf, CommonModule} from "@angular/common";


@Component({
  selector: 'app-slumpgenerator-location',
  imports: [NgForOf, CommonModule],
  templateUrl: './slumpgenerator-location.component.html',
  styleUrl: './slumpgenerator-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SlumpgeneratorLocationComponent {

}

