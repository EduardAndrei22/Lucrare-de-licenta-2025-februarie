import { TestBed } from '@angular/core/testing';

import { PrefabitemService } from './prefabitem.service';

describe('PrefabitemService', () => {
  let service: PrefabitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefabitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
