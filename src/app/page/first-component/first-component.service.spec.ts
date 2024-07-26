import { TestBed } from '@angular/core/testing';

import { FirstComponentService } from './first-component.service';

describe('FirstComponentService', () => {
  let service: FirstComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
