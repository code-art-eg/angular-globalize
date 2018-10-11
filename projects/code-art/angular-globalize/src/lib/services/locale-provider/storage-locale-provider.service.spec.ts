import { TestBed } from '@angular/core/testing';

import { StorageLocaleProviderService } from './storage-locale-provider.service';
import { CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../../constants';

describe('StorageLocaleProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
        StorageLocaleProviderService,
      ]
    });
    localStorage.clear();
  });

  it('should be created', () => {
    const service: StorageLocaleProviderService = TestBed.get(StorageLocaleProviderService);
    expect(service).toBeTruthy();
  });

  it('can be written to', () => {
    const service: StorageLocaleProviderService = TestBed.get(StorageLocaleProviderService);
    expect(service.canWrite).toBe(true);
  });

  it('can set and get a value', () => {
    const service: StorageLocaleProviderService = TestBed.get(StorageLocaleProviderService);
    service.locale = 'en';
    expect(service.locale).toBe('en');
  });
});
