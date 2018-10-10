# @code-art/angular-globalize

## About the library

The ```@code-art/angular-globalize``` library is a javascript library that provides pipes for date, number and currency formatting for [Angular 6](https://angular.io).
It also provides services for parsing and formatting dates and numbers as well as setting the current culture. It depends on and leverages the [globalize](https://github.com/globalizejs) javascript library for performing this.

## Consuming the library

To install the library in your Angular application you need to run the following commands:

```bash
$ npm install @code-art/angular-globalize globalize cldr cldr-data --save
$ npm install @types/globalize --save-dev
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as Globalize from "globalize";

import { AppComponent } from './app.component';

// Minimum imports classes library
import {
    GlobalizationModule, // This modules export pipes for formatting date, number and currency.
    GlobalizationServicesModule, // This module provides default implementation for services required by GlobalizatioModule
    CANG_SUPPORTED_CULTURES, // This import is needed to provide the languages your application support
} from '@code-art/angular-globalize';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify the library's modules as imports
    GlobalizationModule, GlobalizationServicesModule
  ],
  providers: [
        // Provide a string array of languages your application support
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG'] }
    ]
  bootstrap: [AppComponent]
})
export class AppModule { 
    constructor() {
        
        // Load CLDR data. Refer to Globalize documentation for which data to load.
        // gdate, gdatetime, gtime pipes use date and week data
        // gnumber piple use number data
        
        // The two json files below are always needed
        // The two json files cldr-data/supplemental/likelySubtags.json 
        // and cldr-data/supplemental/numberingSystems.json
        // are always needed. Therefore they are loaded by the library itself 
        // and there is no need to load them again.
        
        // The following files are needed only if you are using date formatting/parsing.
        // They are used by the gdate, gtime and gdatetime piples
        Globalize.load(require('cldr-data/supplemental/metaZones.json'));
        Globalize.load(require('cldr-data/supplemental/timeData.json'));
        Globalize.load(require('cldr-data/supplemental/weekData.json'));
        
        // The following file is needed only if you are using currency formatting.
        Globalize.load(require('cldr-data/supplemental/currencyData.json'));
        // The following file is needed only if you are using style:name or style:code for formatting currency.
        Globalize.load(require('cldr-data/supplemental/plurals.json'));

        // Load only the files for locales you use
        // cldr-data/main/<lang>/numbers.json is always needed
        // cldr-data/main/<lang>/ca-gregorian.json and cldr-data/main/<lang>/timeZoneNames.json 
        // are needed only for date formatting (gdate, gtime and gdatetime piple)
        // cldr-data/main/<lang>/currencies.json is needed for currency formatting (gcurrency pipe)
        
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
```

Once the library is imported and cldr data is loaded, you can use its components, directives and pipes in your Angular application:

```html
<!-- You can now use the library component in app.component.html -->
<h1>
  {{title}}
</h1>
{{ jsDate | gdate }} <!-- example output 10/02/2018 using en-GB -->
{{ jsDate | gtime }} <!-- example output 13:49 using en-GB -->
{{ jsDate | gdatetime }} <!-- example output 10/02/2018, 13:49 using en-GB-->
{{ jsDate | gdate:'de' }} <!-- example output 10.02.18 -->
{{ jsDate | gdatetime:'ar-EG':'full' }} <!-- example output السبت، ١٠ فبراير ٢٠١٨ ١:٤٩:٢٠ م غرينتش+٠٢:٠٠ -->
{{ jsDate | gdatetime:'full' }} <!-- example output Saturday, 10 February 2018 at 13:49:20 GMT+02:00 using en-GB -->
{{ jsDate | gdatetime:'raw:yyyy-MM-dd' }} <!-- example output 2018-02-10 -->
{{ jsDate | gdatetime:'yQQQHm' }} <!-- example output Q1 2018, 13:49 -->
{{ jsDate | gdatetime:'ar-EG':'yQQQHm'}} <!-- example output الربع الأول ٢٠١٨ ١٣:٤٩ -->
{{ jsDate | gdatetime:{ datetime: 'medium', timeZone: 'America/New_York' } }} <!-- example output 10 Feb 2018, 06:49:20 -->
{{ 1234567.98765 | gnumber }} <!-- example output 1,234,567.988 -->
{{ 0.5| gnumber:'%' }} <!-- example output 50% -->
{{ 1234567.98765 | gcurrency:'EUR'}} <!-- example output €1,234,567.99 -->
{{ 1234567.98765 | gcurrency:'EGP':'ar-EG':{ style: 'name', maximumFractionDigits:3, minimumFractionDigits:3 } }} <!-- example output ١٬٢٣٤٬٥٦٧٫٩٨٨ جنيه مصري -->
``` 

## Getting/Setting Current Culture

By default the component will use the value provided by [LOCALE_ID](https://angular.io/api/core/LOCALE_ID) in Angular. To change current culture you can is the ```CurrentCultureService``` service which can be injected in your component or service.

Example: 

```typescript
import { Component, Inject } from '@angular/core';

import { CurrentCultureService } from '@code-art/angular-globalize';

@Component({
    selector: 'my',
    templateUrl: './my.component.html'
})
export class MyComponent {
    constructor(cultureService: CurrentCultureService) {
        cultureService.currentCulture = 'de'; // Change the language to german
    }
    
}
```

In addition to the ```currentCulture``` property, the ```CurrentCultureService``` interface exposes a ```cultureObservable``` property of type ```Observable<string>``` which you can use to subscribe to current culture change events.

## (Optional) Saving Culture between sessions

The component exposes ```CookieLocaleProvider``` and ```StorageLocaleProvider``` services. You an you can provide either one of them in your ```AppModule``` using ```CA_ANGULAR_LOCALE_PROVIDER``` injection token. 

Example:

```typescript 
@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, LanguageSwitchComponent],
    imports: [BrowserModule,
        
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
    ...
}
```

## TODO

The library needs better documentation, more samples and a demo site. In the future I plan to add support for other features exposed by Globalize such as units, messages, pluralization, etc.

## License

MIT © Sherif Elmetainy \(Code Art\)
