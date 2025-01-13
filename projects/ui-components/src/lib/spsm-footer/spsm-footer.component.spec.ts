import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsmFooterComponent } from './spsm-footer.component';

describe('SpsmFooterComponent', () => {
  let component: SpsmFooterComponent;
  let fixture: ComponentFixture<SpsmFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpsmFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpsmFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
