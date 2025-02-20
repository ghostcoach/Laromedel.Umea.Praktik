import { TestBed } from '@angular/core/testing';

import { ShuffleWordsService } from './shuffle-words.service';

describe('ShuffleWordsService', () => {
  let service: ShuffleWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShuffleWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
