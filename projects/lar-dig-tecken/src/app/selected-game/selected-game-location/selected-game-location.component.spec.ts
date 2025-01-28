import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedGameLocationComponent } from './selected-game-location.component';

describe('SelectedGameLocationComponent', () => {
  let component: SelectedGameLocationComponent;
  let fixture: ComponentFixture<SelectedGameLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedGameLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedGameLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
