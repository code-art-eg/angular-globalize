# @code-art/angular-globalize

## About the library

The ```@code-art/angular-globalize``` library is a javascript library that provides pipes for date, number and currency formatting for [Angular 6](https://angular.io).
It also provides services for parsing and formatting dates and numbers as well as setting the current culture. It depends on and leverages the [globalize](https://github.com/globalizejs) javascript library for performing this.

## Consuming the library

### 1. Installing the library

To install the library in your Angular application you need to run the following commands:

```bash
$ npm install @code-art/angular-globalize globalize cldr cldr-data --save
$ npm install @types/globalize @types/node --save-dev
```
or

```bash
$ yarn add @code-art/angular-globalize globalize cldr cldr-data
$ yarn add @types/globalize @types/node -D
```
**Note:** *Since version 3.x of this library was rewritten, Versions 1.x and 2.x of the library available on npmjs are not compatible with this version.*

### 2. Modifying tsconfig.json

To be able to load [globalize](https://github.com/globalizejs) modules in your TypeScript app, you need to include the paths for globalizejs and cldrjs modules and types definitions for globalize and node (to be able to use require TypeScript) in your tsconfig.json as follows:

```json
{
  "compilerOptions": {
    ... 
    "types": [
        "globalize",
        "node",
    ]
    "paths": {
      "globalize": [
        "node_modules/globalize/dist/globalize"
      ],
      "globalize/*": [
        "node_modules/globalize/dist/globalize/*"
      ],
      "cldr": [
        "node_modules/cldrjs/dist/cldr"
      ],
      "cldr/*": [
        "node_modules/cldrjs/dist/cldr/*"
      ]
    }
  }
}
```

### 3. Import globalize modules in your app

To use the library, you will always need to import the  `globalize` and `globalize/number` modules. You can also import `globalize/date` if you need to use date formatting or parsing functionality, and/or `globalize/plural` and `globalize/currency` if you need currency formatting functionalities with currency names. Globalizejs has other useful modules as well, but as they are currently not used or needed by this library. Refer to the Globalizejs documentation for more information.

```typescript
import * as Globalize from 'globalize'; // This is needed to call Globalize static to load CLDR data.
import 'globalize/number';
import 'globalize/date'; // needed for date formatting and parsing
import 'globalize/plural'; // needed only for currency formatting
import 'globalize/currency'; // needed only for currency formatting
```

### 4. Load CLDR data
When using Globalize you need to only need the locale data that your application needs. The locale data are provided as json files by the [cldr-data npm package](https://www.npmjs.com/package/cldr-data). Calling [`Globalize.load`](https://github.com/globalizejs/globalize/blob/master/doc/api/core/load.md) function as many times as needed to load the locale data your application needs.

```typescript
// This function needs to be called once in your app. The AppModule constructor is a good place to call it.
function loadCldrData() {
    // Load CLDR data. Refer to Globalize documentation for which data to load.
    // gdate, gdatetime, gtime pipes use date and week data
    // gnumber piple use number data

    // The two json files below are always needed
    Globalize.load(require('cldr-data/supplemental/likelySubtags.json'));
    Globalize.load(require('cldr-data/supplemental/numberingSystems.json'));

    // The following files are needed only if you are using date formatting/parsing.
    // They are used by the gdate, gtime and gdatetime pipes
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
```

### 5. Import the angular module
Next you need to import the `AngularGlobalizeModule` in your application module.

```typescript
// Minimum imports classes library
import {
    AngularGlobalizeModule, // This modules export pipes for formatting date, number and currency.
    CANG_SUPPORTED_CULTURES, // This import is needed to provide the languages your application support
} from '@code-art/angular-globalize';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularGlobalizeModule.forRoot(), // Import this only in root app module
    AngularGlobalizeModule, // import this in every module where the pipes and directives are needed.
  ],
  providers: [
        // Provide a string array of languages your application support
        // If you don't provide this value, the AngularGlobalizeModule.forRoot() will default to 'en' culture (United States English).
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG'] }
    ]
  bootstrap: [AppComponent]
})
export class AppModule { 
    constructor() {
        loadCldrData();      
    }
}
```

### 6. Use the library pipes in your components

Once the library is imported and cldr data is loaded, you can use its components, directives and pipes in your Angular application:

```html
<!-- You can now use the library component in app.component.html -->
<h1>
  {{title}}
</h1>
Short Date (current culture): {{ jsDate | gdate }} <br/><!-- example output 10/02/2018 using en-GB -->
Short time (current culture): {{ jsDate | gtime }} <br/><!-- example output 13:49 using en-GB -->
Short date/time (current culture): {{ jsDate | gdatetime }} <br/><!-- example output 10/02/2018, 13:49 using en-GB-->
Short Date (German Germany): {{ jsDate | gdate:'de' }} <br/><!-- example output 10.02.18 -->
Full Date (Arabic Egypt):  {{ jsDate | gdatetime:'ar-EG':'full' }} <br/><!-- example output السبت، ١٠ فبراير ٢٠١٨ ١:٤٩:٢٠ م غرينتش+٠٢:٠٠ -->
Full Date (Current culture): {{ jsDate | gdatetime:'full' }} <br/><!-- example output Saturday, 10 February 2018 at 13:49:20 GMT+02:00 using en-GB -->
Custom Date Format (Current culture): {{ jsDate | gdatetime:'raw:yyyy-MM-dd' }} <br/><!-- example output 2018-02-10 -->
Custom Date Format (Current culture): {{ jsDate | gdatetime:'yQQQHm' }} <br/><!-- example output Q1 2018, 13:49 -->
Custom Date Format (Arabic Egypt): {{ jsDate | gdatetime:'ar-EG':'yQQQHm'}} <br/><!-- example output الربع الأول ٢٠١٨ ١٣:٤٩ -->

Number Format (Current culture): {{ 1234567.98765 | gnumber }} <br/><!-- example output 1,234,567.988 -->
Percentage Format (Current culture): {{ 0.5| gnumber:'%' }} <br/><!-- example output 50% -->
Currency  Format with symbol (Current culture): {{ 1234567.98765 | gcurrency:'EUR'}} <br/><!-- example output €1,234,567.99 -->
Currency  Format with name (Arabic Egypt): {{ 1234567.98765 | gcurrency:'EGP':'ar-EG':{ style: 'name', maximumFractionDigits:3, minimumFractionDigits:3 } }} <br/><!-- example output ١٬٢٣٤٬٥٦٧٫٩٨٨ جنيه مصري -->
``` 

## Getting/Setting Current Culture

By default the library will use the value provided by [LOCALE_ID](https://angular.io/api/core/LOCALE_ID) in Angular. If not available, it will use the browser language. However, the current language will always be one of the supported languages. If the The LOCALE_ID or browser language are not in the supported languages, the first language will be used as the default. To change current culture you can is the ```CurrentCultureService``` service which can be injected in your component or service.

Example: 

```typescript
import { Component } from '@angular/core';

import { CurrentCultureService } from '@code-art/angular-globalize';

@Component({
    selector: 'app-change-language',
    template: `
        <button (click)="changeLanguage('en-GB')">English (United Kingdom)</button>
        <button (click)="changeLanguage('ar-EG')">Arabic (Egypt)</button>
        <button (click)="changeLanguage('de')">German (Germany)</button>
    `
})
export class ChangeLanguageComponent {
    constructor(public readonly cultureService: CurrentCultureService) {
    }
    
    public changeLanguage(language: string): void {
        this.cultureService.currentCulture = language;
    }
}
```

In addition to the `currentCulture` property, the `CurrentCultureService` interface exposes a `cultureObservable` property of type `Observable<string>` which you can use to subscribe to current culture change events.

## (Optional) Saving Culture between sessions

The component exposes ```CookieLocaleProviderService``` and ```StorageLocaleProviderService``` services. You an you can provide either one of them in your ```AppModule``` using ```CANG_LOCALE_PROVIDER``` injection token. 

Example:

```typescript 
@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, LanguageSwitchComponent],
    imports: [BrowserModule,
         AngularGlobalizeModule.forRoot(), // Import this only in root app module
         AngularGlobalizeModule, // import this in every module where the pipes and directives are needed.
        ],
    providers: [
        // Provide a string array of languages your application support
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG'] },
        { provide: CANG_LOCALE_PROVIDER, useClass: CookieLocaleProviderService, multi: true },
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
