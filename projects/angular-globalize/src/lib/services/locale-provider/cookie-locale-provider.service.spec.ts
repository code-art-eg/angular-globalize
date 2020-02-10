import { TestBed } from '@angular/core/testing';
import { CookieLocaleProviderService } from './cookie-locale-provider.service';

describe('CookieLocaleProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [CookieLocaleProviderService],
  }));

  it('should be created', () => {
    const service: CookieLocaleProviderService = TestBed.inject(CookieLocaleProviderService);
    expect(service).toBeTruthy();
  });

  it('can be written to', () => {
    const service: CookieLocaleProviderService = TestBed.inject(CookieLocaleProviderService);
    expect(service.canWrite).toBe(true);
});

  it('can set and get a value', () => {
    const service: CookieLocaleProviderService = TestBed.inject(CookieLocaleProviderService);
    service.locale = 'en';
    expect(service.locale).toBe('en');
  });
});
