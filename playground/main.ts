import 'reflect-metadata';
import 'zone.js';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
    GlobalizationModule, // This modules export pipes for formatting date, number and currency.
    GlobalizationServicesModule, // This module provides default implementation for services required by GlobalizatioModule
    CANG_GLOBALIZE_STATIC, // This import is needed to load cldr-data while initializing your AppModule
    CANG_SUPPORTED_CULTURES, // This import is needed to provide the languages your application support
    CA_ANGULAR_LOCALE_PROVIDER, CookieLocaleProvider
} from '@code-art/angular-globalize';

import { AppComponent } from './app.component';
import { LanguageSwitchComponent } from './language-switch.component';


@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, LanguageSwitchComponent],
    imports: [
        BrowserModule,
        // Specify the library's modules as imports
        GlobalizationModule, GlobalizationServicesModule
        ],
    providers: [
        // Provide a string array of languages your application support
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG'] },
        { provide: CA_ANGULAR_LOCALE_PROVIDER, useClass: CookieLocaleProvider, multi: true },
    ]
})
class AppModule {
    constructor( @Inject(CANG_GLOBALIZE_STATIC) Globalize: GlobalizeStatic) {
        
        Globalize.loadTimeZone(require('iana-tz-data/iana-tz-data.json'));

        Globalize.load(require('cldr-data/supplemental/metaZones.json'));
        Globalize.load(require('cldr-data/supplemental/timeData.json'));
        Globalize.load(require('cldr-data/supplemental/weekData.json'));
        
        Globalize.load(require('cldr-data/supplemental/currencyData.json'));
        Globalize.load(require('cldr-data/supplemental/plurals.json'));

        Globalize.load(require('cldr-data/main/en-GB/numbers.json'));
        Globalize.load(require('cldr-data/main/en-GB/ca-gregorian.json'));
        Globalize.load(require('cldr-data/main/en-GB/timeZoneNames.json'));
        Globalize.load(require('cldr-data/main/en-GB/currencies.json'));

        Globalize.load(require('cldr-data/main/de/ca-gregorian.json'));
        Globalize.load(require('cldr-data/main/de/timeZoneNames.json'));
        Globalize.load(require('cldr-data/main/de/numbers.json'));
        Globalize.load(require('cldr-data/main/de/currencies.json'));

        Globalize.load(require('cldr-data/main/ar-EG/ca-gregorian.json'));
        Globalize.load(require('cldr-data/main/ar-EG/timeZoneNames.json'));
        Globalize.load(require('cldr-data/main/ar-EG/numbers.json'));
        Globalize.load(require('cldr-data/main/ar-EG/currencies.json'));
    }
}

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        const oldRootElem = document.querySelector('app');
        const newRootElem = document.createElement('app');
        oldRootElem!.parentNode!.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(appModule => appModule.destroy());
    });
}

const modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);