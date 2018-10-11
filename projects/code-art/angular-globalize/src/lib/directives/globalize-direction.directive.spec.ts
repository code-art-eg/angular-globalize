import { Component } from '@angular/core';

import { GlobalizeDirectionDirective } from './globalize-direction.directive';
import { TestBed } from '@angular/core/testing';

import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../constants';
import { StorageLocaleProviderService } from '../services/locale-provider/storage-locale-provider.service';
import { By } from '@angular/platform-browser';
import { CurrentCultureService } from '../services/current-culture/current-culture.service';

@Component({
  template: `<div glbDirection rtlCssClass='r' ltrCssClass='l'></div>`,
})
class TestDirectionComponent {

}

describe('GlobalizeDirectionDirective', () => {
  const cultures = ['en-GB', 'ar-EG', 'de'];
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDirectionComponent, GlobalizeDirectionDirective],
      providers: [
        {
            provide: CANG_SUPPORTED_CULTURES, useValue: cultures,
        },
        {
            provide: CANG_LOCALE_PROVIDER, useClass: StorageLocaleProviderService, multi: true,
        },
        { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
      ],
    }).compileComponents();
  });
  it('should default to ltr', () => {
    const fixture = TestBed.createComponent(TestDirectionComponent);
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div'));
    const divNative = divEl.nativeElement as HTMLDivElement;
    expect(divNative.dir).toBe('ltr');
    expect(divNative.className).toBe('l');
  });

  it('should change direction', () => {
    const fixture = TestBed.createComponent(TestDirectionComponent);
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div'));
    const divNative = divEl.nativeElement as HTMLDivElement;
    expect(divNative.dir).toBe('ltr');
    expect(divNative.className).toBe('l');

    const cultureService: CurrentCultureService = TestBed.get(CurrentCultureService);
    cultureService.currentCulture = 'ar';
    expect(divNative.dir).toBe('rtl');
    expect(divNative.className).toBe('r');

    cultureService.currentCulture = 'en';

    expect(divNative.dir).toBe('ltr');
    expect(divNative.className).toBe('l');
  });
});
