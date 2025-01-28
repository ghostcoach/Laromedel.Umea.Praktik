import { Component } from '@angular/core';
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
  onStart(){
    console.log('start button works');
    
  }
}
