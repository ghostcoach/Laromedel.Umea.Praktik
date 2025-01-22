import { Component } from '@angular/core';

@Component({
  selector: 'app-start-button',
  imports: [],
  templateUrl: './start-button.component.html',
  styleUrl: './start-button.component.scss'
})
export class StartButtonComponent {
  onStart(){
    console.log('start button works');
    
  }
}
