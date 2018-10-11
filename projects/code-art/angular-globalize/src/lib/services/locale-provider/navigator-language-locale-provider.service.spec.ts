import { TestBed } from '@angular/core/testing';
import { NavigatorLanguageLocaleProviderService } from './navigator-language-locale-provider.service';

describe('NavigatorLanguageLocaleProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigatorLanguageLocaleProviderService = TestBed.get(NavigatorLanguageLocaleProviderService);
    expect(service).toBeTruthy();
  });

  it('can not be written to', () => {
    const service: NavigatorLanguageLocaleProviderService = TestBed.get(NavigatorLanguageLocaleProviderService);
    expect(service.canWrite).toBe(false);
});

  it('can set and get a value', () => {
    const service: NavigatorLanguageLocaleProviderService = TestBed.get(NavigatorLanguageLocaleProviderService);
    expect(service.locale).toBe(navigator.languages[0]);
  });
});
