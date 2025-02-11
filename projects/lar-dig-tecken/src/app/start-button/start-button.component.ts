import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-start-button',
  imports: [CommonModule],
  templateUrl: './start-button.component.html',
  styleUrl: './start-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartButtonComponent {
  @Input() startBtnActive: boolean = true;

  onStart(): void{}
}
