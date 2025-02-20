import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StartButtonStateQueries } from './state/start-button-queries';


@Component({
  selector: 'app-start-button',
  imports: [CommonModule],
  templateUrl: './start-button.component.html',
  styleUrl: './start-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartButtonComponent implements OnInit {
  @Input() onClick: () => void = () => {};
  @Select(StartButtonStateQueries.startBtnActive$) startBtnActive$!: Observable<boolean>;
  startBtnActive: boolean = true;

  // onStart(): void{}

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.startBtnActive$.subscribe(state => {
      this.startBtnActive = state;
    });
  }

}
