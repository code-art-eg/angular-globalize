# @code-art/angular-datepicker

## About the library

The `@code-art/angular-datepicker` library is a javascript library that a datepicker for [Angular 6](https://angular.io). 

## Consuming the library

### 1. Installing the library
The library depends on [angular-globalize](https://github.com/sherif-elmetainy/angular-globalize) and [globalize](https://github.com/globalizejs/globalize) for localization and date formatting functionality. Please refer to the documentation of those packages for usage.

To install the library in your Angular application you need to run the following commands:

```bash
$ npm install @code-art/angular-datepicker @code-art/angular-globalize globalize cldr cldr-data --save
$ npm install @types/globalize @types/node --save-dev
```

Or

```bash
$ yarn add @code-art/angular-datepicker @code-art/angular-globalize globalize cldr cldr-data
$ yarn add @types/globalize @types/node -D
```
**Note:** _The previous versions of this library (1.x) which are available on npm repository are not compatible with the rewritten 2.x (current) version._

### 2. Modifying tsconfig.json

To be able to load [globalize](https://github.com/globalizejs) modules in your TypeScript app, you need to include the paths for globalizejs and cldrjs modules and types definitions for globalize and node (to be able to use require TypeScript) in your tsconfig.json as follows:

```json
{
  "compilerOptions": {
    // ... 
    "types": [
        "globalize",
        "node",
        // ... 
    ]
    "paths": {
      // ... 
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

To use the library, you will always need to import the  `globalize` and `globalize/number` and `globalize/date` modules. These are used by `@code-art/angular-globalize` library which is in turn used by this library for date formatting and parsing. Globalizejs has other useful modules as well, but they are currently not used or needed by this library. Refer to the Globalizejs documentation for more information.

```typescript
import * as Globalize from 'globalize'; // This is needed to call Globalize static to load CLDR data.
import 'globalize/number';
import 'globalize/date'; // needed for date formatting and parsing
```

### 4. Load CLDR data
When using Globalize you need to only need the locale data that your application needs. The locale data are provided as json files by the [cldr-data npm package](https://www.npmjs.com/package/cldr-data). Calling [`Globalize.load`](https://github.com/globalizejs/globalize/blob/master/doc/api/core/load.md) function as many times as needed to load the locale data your application needs.

```typescript
// This function needs to be called once in your app. The AppModule constructor is a good place to call it.
function loadCldrData() {
    
    // The two json files below are always needed
    Globalize.load(require('cldr-data/supplemental/likelySubtags.json'));
    Globalize.load(require('cldr-data/supplemental/numberingSystems.json'));

    // The following files are needed only if you are using date formatting/parsing.
    // They are used by the gdate, gtime and gdatetime pipes
    Globalize.load(require('cldr-data/supplemental/metaZones.json'));
    Globalize.load(require('cldr-data/supplemental/timeData.json'));
    Globalize.load(require('cldr-data/supplemental/weekData.json'));

    // Load only the files for locales you use
    
    Globalize.load(require('cldr-data/main/en-GB/numbers.json'));
    Globalize.load(require('cldr-data/main/en-GB/ca-gregorian.json'));
    Globalize.load(require('cldr-data/main/en-GB/timeZoneNames.json'));
    
    Globalize.load(require('cldr-data/main/de/ca-gregorian.json'));
    Globalize.load(require('cldr-data/main/de/timeZoneNames.json'));
    Globalize.load(require('cldr-data/main/de/numbers.json'));
    
    Globalize.load(require('cldr-data/main/ar-EG/ca-gregorian.json'));
    Globalize.load(require('cldr-data/main/ar-EG/timeZoneNames.json'));
    Globalize.load(require('cldr-data/main/ar-EG/numbers.json'));
}
```

### 5. Import the angular module

After getting the library from npm you can use it in your Angular `AppModule`:

```typescript

import {
    AngularGlobalizeModule, // This modules export pipes for formatting date, number and currency.
    CANG_SUPPORTED_CULTURES, // This import is needed to provide the languages your application support
} from '@code-art/angular-globalize';
import { AngularDatepickerModule } from '@code-art/angular-datepicker';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularGlobalizeModule.forRoot(), // Import this only in root app module
    // Specify the library's module as imports. Import this in every module that uses the date or time picker components
    AngularDatepickerModule,
    FormsModule, // imported to use ngModel directive
  ],
  bootstrap: [AppComponent],
  providers: [
        // Provide a string array of languages your application support
        // If you don't provide this value, the AngularGlobalizeModule.forRoot() will default to 'en' culture (United States English).
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG'] }
    ]
})
export class AppModule { 
    constructor() {
        loadCldrData();
    }
}
```

### 6. Use the library components and directives in your app


```html
<!-- You can now use the library component in app.component.html -->
<h1>
  {{title}}
</h1>

<!-- Time Picker standalone component !-->
<cadp-timepicker [(ngModel)]="date"></cadp-timepicker>

<!-- Time Picker attached as a popup to a text input !-->
<input class='form-control' cadpTimePicker [(ngModel)]="time" />

<!-- Date range picker standalone component !-->
<cadp-daterangepicker  [(ngModel)]="range"></cadp-daterangepicker>

<!-- Date range Picker attached to a popup to a text input !-->
<input class='form-control' cadpDateRangePicker [(ngModel)]="range" />

<!-- Date/Time Picker standalone component !-->
<cadp-datetimepicker [(ngModel)]="datetime"></cadp-datetimepicker>

<!-- Date/Time Picker attached to a popup to a text input !-->
<input class='form-control' cadpDateTimePicker [(ngModel)]="datetime" />

<!-- Date Picker standalone component !-->
<cadp-datepicker [(ngModel)]="datetime"></cadp-datepicker>

<!-- Date/Time Picker attached to a popup to a text input !-->
<input class='form-control' cadpDatePicker [(ngModel)]="date" />
``` 

## TODO

The library needs better documentation, more samples and a demo site. 

## License

MIT © Sherif Elmetainy \(Code Art\)
