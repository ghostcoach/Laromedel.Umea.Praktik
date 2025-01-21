import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrateCanonComponent } from './celebrate-canon.component';

describe('CelebrateCanonComponent', () => {
  let component: CelebrateCanonComponent;
  let fixture: ComponentFixture<CelebrateCanonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelebrateCanonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CelebrateCanonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
