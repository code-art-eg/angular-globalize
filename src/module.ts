import { NgModule } from '@angular/core';

import { GlobalizeDatePipe } from './pipes/globalize-date.pipe';
import { GlobalizeDateTimePipe } from './pipes/globalize-datetime.pipe';
import { GlobalizeTimePipe } from './pipes/globalize-time.pipe';
import { GlobalizeCurrencyPipe } from './pipes/globalize-currency.pipe';
import { GlobalizeNumberPipe } from './pipes/globalize-number.pipe';
import { GlobalizeDayPipe } from './pipes/globalize-day.pipe';
import { GlobalizeMonthPipe } from './pipes/globalize-month.pipe';
import { GlobalizeDirectionDirective } from './directives/globalize-direction.directive';

import { CANG_CULTURE_SERVICE, 
    CANG_SUPPORTED_CULTURES, 
    CurrentCultureService,
    CANG_COOKIE_DURATION_DAYS,
    CANG_COOKIE_NAME,
    CANG_COOKIE_PATH,
    CANG_DEFAULT_COOKIE_DURATION_DAYS,
    CANG_DEFAULT_COOKIE_NAME,
    CANG_DEFAULT_LOCALE_KEY,
    CANG_LOCALE_STORAGE_KEY,
    CANG_USE_SESSION_STORAGE,
    CA_ANGULAR_LOCALE_PROVIDER,
    AngularDefaultLocaleProvider,
    NavigatorLanguageLocaleProvider,
    } from './services/current-culture.service'
import { CANG_GLOBALIZATION_SERVICE, CANG_GLOBALIZE_STATIC, DefaultGlobalizationService, globalizeStatic } from './services/globalize.service';
import { CANG_TYPE_CONVERTER_SERVICE, TypeConverterService } from './services/type-conversion.service';

export * from './services/globalize.service';
export * from './services/type-conversion.service';
export * from './services/current-culture.service';


@NgModule({
    declarations: [
        GlobalizeDatePipe,
        GlobalizeDateTimePipe,
        GlobalizeTimePipe,
        GlobalizeCurrencyPipe,
        GlobalizeNumberPipe,
        GlobalizeMonthPipe,
        GlobalizeDayPipe,
        GlobalizeDirectionDirective
    ],
    exports: [
        GlobalizeDatePipe,
        GlobalizeDateTimePipe,
        GlobalizeTimePipe,
        GlobalizeCurrencyPipe,
        GlobalizeNumberPipe,
        GlobalizeMonthPipe,
        GlobalizeDayPipe,
        GlobalizeDirectionDirective
    ]
})
export class GlobalizationModule {

}

@NgModule({
    providers: [
        { provide: CANG_CULTURE_SERVICE, useClass: CurrentCultureService},
        { provide: CANG_GLOBALIZATION_SERVICE, useClass: DefaultGlobalizationService},
        { provide: CANG_TYPE_CONVERTER_SERVICE, useClass: TypeConverterService},
        { provide: CANG_GLOBALIZE_STATIC, useValue: globalizeStatic},
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en']},
        
        { provide: CANG_COOKIE_DURATION_DAYS, useValue: CANG_DEFAULT_COOKIE_DURATION_DAYS},
        { provide: CANG_COOKIE_NAME, useValue: CANG_DEFAULT_COOKIE_NAME},
        { provide: CANG_COOKIE_PATH, useValue: '/' },
        { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
        { provide: CANG_USE_SESSION_STORAGE, useValue: false },

        { provide: CA_ANGULAR_LOCALE_PROVIDER, useClass: NavigatorLanguageLocaleProvider, multi: true },
        { provide: CA_ANGULAR_LOCALE_PROVIDER, useClass: AngularDefaultLocaleProvider, multi: true }
    ]
})
export class GlobalizationServicesModule {

}