import { TestBed } from '@angular/core/testing';

import { NormalizeCharactersService } from './normalize-characters.service';

describe('NormalizeCharactersService', () => {
  let service: NormalizeCharactersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NormalizeCharactersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
