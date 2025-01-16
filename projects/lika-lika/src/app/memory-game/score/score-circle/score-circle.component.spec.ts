import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCircleComponent } from './score-circle.component';

describe('ScoreCircleComponent', () => {
  let component: ScoreCircleComponent;
  let fixture: ComponentFixture<ScoreCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
