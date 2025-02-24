import { TestBed } from '@angular/core/testing';

import { SlumpgeneratorService } from './slumpgenerator.service';

describe('SlumpgeneratorService', () => {
  let service: SlumpgeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlumpgeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
