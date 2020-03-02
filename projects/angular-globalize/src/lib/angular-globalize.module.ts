import { NgModule, ModuleWithProviders } from '@angular/core';

import { GlobalizeCurrencyPipe } from './pipes/currency/globalize-currency.pipe';
import { GlobalizeDayPipe } from './pipes/day/globalize-day.pipe';
import { GlobalizeDatePipe } from './pipes/date/globalize-date.pipe';
import { GlobalizeDateTimePipe } from './pipes/datetime/globalize-datetime.pipe';
import { GlobalizeTimePipe } from './pipes/time/globalize-time.pipe';
import { GlobalizeDurationPipe } from './pipes/duration/globalize-duration.pipe';
import { GlobalizeMonthPipe } from './pipes/month/globalize-month.pipe';
import { GlobalizeNumberPipe } from './pipes/number/globalize-number.pipe';
import { GlobalizeDirectionDirective } from './directives/globalize-direction.directive';
import { CANG_SUPPORTED_CULTURES, CANG_COOKIE_DURATION_DAYS,
  CANG_DEFAULT_COOKIE_DURATION_DAYS, CANG_COOKIE_NAME, CANG_DEFAULT_COOKIE_NAME,
  CANG_COOKIE_PATH, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY,
  CANG_USE_SESSION_STORAGE, CANG_LOCALE_PROVIDER } from './constants';
import { NavigatorLanguageLocaleProviderService } from './services/locale-provider/navigator-language-locale-provider.service';

@NgModule({
  imports: [
  ],
  declarations: [
    GlobalizeCurrencyPipe,
    GlobalizeDayPipe,
    GlobalizeDatePipe,
    GlobalizeDateTimePipe,
    GlobalizeTimePipe,
    GlobalizeDurationPipe,
    GlobalizeMonthPipe,
    GlobalizeNumberPipe,
    GlobalizeDirectionDirective,
  ],
  exports: [
    GlobalizeCurrencyPipe,
    GlobalizeDayPipe,
    GlobalizeDatePipe,
    GlobalizeDateTimePipe,
    GlobalizeTimePipe,
    GlobalizeDurationPipe,
    GlobalizeMonthPipe,
    GlobalizeNumberPipe,
    GlobalizeDirectionDirective,
  ],
})
export class AngularGlobalizeModule {
  public static forRoot(): ModuleWithProviders<AngularGlobalizeModule> {
    return {
      ngModule: AngularGlobalizeModule,
      providers: [
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en'] },
        { provide: CANG_COOKIE_DURATION_DAYS, useValue: CANG_DEFAULT_COOKIE_DURATION_DAYS },
        { provide: CANG_COOKIE_NAME, useValue: CANG_DEFAULT_COOKIE_NAME },
        { provide: CANG_COOKIE_PATH, useValue: '/' },
        { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
        { provide: CANG_USE_SESSION_STORAGE, useValue: false },
        { provide: CANG_LOCALE_PROVIDER, useClass: NavigatorLanguageLocaleProviderService, multi: true },
      ],
    };
  }
}
