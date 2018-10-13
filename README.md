# @code-art/angular-datepicker

## About the library

The ```@code-art/angular-datepicker``` library is a javascript library that a datepicker for [Angular 6](https://angular.io). 

## Consuming the library

The library depends on [angular-globalize](https://github.com/sherif-elmetainy/angular-globalize) and [globalize](https://github.com/globalizejs/globalize) for localization and date formatting functionality. Please refer to the documentation of those packages for usage.

To install the library in your Angular application you need to run the following commands:

```bash
$ npm install @code-art/angular-datepicker @code-art/angular-globalize globalize cldr cldr-data --save
$ npm install @types/globalize --save-dev
```

After getting the library from npm you can use it in your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject } from '@angular/core';

import { AppComponent } from './app.component';

// Minimum imports classes library
import { AngularDatepickerModule } from '@code-art/angular-datepicker';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify the library's modules as imports
    AngularDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
    constructor() {
        
    }
}
```
You need to load the CLDR data for the locales you want to use for DatePicker. Please refer to [angular-globalize](https://github.com/sherif-elmetainy/angular-globalize) documentation for example. Once the library is imported, you can use its components in your Angular application:

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
