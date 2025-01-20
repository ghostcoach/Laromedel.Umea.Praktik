import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlumpgeneratorLocationComponent } from './slumpgenerator-location.component';

describe('SlumpgeneratorLocationComponent', () => {
  let component: SlumpgeneratorLocationComponent;
  let fixture: ComponentFixture<SlumpgeneratorLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlumpgeneratorLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlumpgeneratorLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
