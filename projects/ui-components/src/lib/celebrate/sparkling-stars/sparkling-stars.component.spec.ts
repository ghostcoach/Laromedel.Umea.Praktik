import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparklingStarsComponent } from './sparkling-stars.component';

describe('SparklingStarsComponent', () => {
  let component: SparklingStarsComponent;
  let fixture: ComponentFixture<SparklingStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparklingStarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SparklingStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
