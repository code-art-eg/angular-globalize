import { TestBed } from '@angular/core/testing';

import { AngularGlobalizeService } from './angular-globalize.service';

describe('AngularGlobalizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularGlobalizeService = TestBed.get(AngularGlobalizeService);
    expect(service).toBeTruthy();
  });
});
