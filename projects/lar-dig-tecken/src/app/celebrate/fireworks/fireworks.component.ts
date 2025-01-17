import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-fireworks',
  standalone: true,
  imports: [NgIf],
  templateUrl: './fireworks.component.html',
  styleUrl: './fireworks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FireworksComponent {}
