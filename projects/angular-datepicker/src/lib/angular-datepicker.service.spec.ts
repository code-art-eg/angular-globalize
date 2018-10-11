import { TestBed } from '@angular/core/testing';

import { AngularDatepickerService } from './angular-datepicker.service';

describe('AngularDatepickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularDatepickerService = TestBed.get(AngularDatepickerService);
    expect(service).toBeTruthy();
  });
});
