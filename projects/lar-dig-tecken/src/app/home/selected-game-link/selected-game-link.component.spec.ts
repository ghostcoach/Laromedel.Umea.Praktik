import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedGameLinkComponent } from './selected-game-link.component';

describe('SelectedGameLinkComponent', () => {
  let component: SelectedGameLinkComponent;
  let fixture: ComponentFixture<SelectedGameLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedGameLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedGameLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
