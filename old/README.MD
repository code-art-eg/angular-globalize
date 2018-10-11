# @code-art/angular-datepicker

## About the library

The ```@code-art/angular-datepicker``` library is a javascript library that a datepicker for [Angular 5](https://angular.io). 

## Consuming the library

The library depends on [angular-globalize](https://github.com/sherif-elmetainy/angular-globalize) and [globalize](https://github.com/globalizejs/globalize) for localization and date formatting functionality. Please refer to those packages for usage.


*The initial version will be available on NPM soon. This library is still under development.*

After getting the library from npm you can use it in your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject } from '@angular/core';

import { AppComponent } from './app.component';

// Minimum imports classes library
import { DatePickerModule } from '@code-art/angular-datepicker';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify the library's modules as imports
    DatePickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
    constructor() {
        
    }
}
```

Once the library is imported, you can use its components in your Angular application:

```html
<!-- You can now use the library component in app.component.html -->
<h1>
  {{title}}
</h1>

<!-- Time Picker standalone component !-->
<ca-timepicker [(ngModel)]="date"></ca-timepicker>

<!-- Time Picker attached as a popup to a text input !-->
<input class='form-control' caTimePicker [caInputAddon]="'time'" [(ngModel)]="time" />

<!-- Date range picker standalone component !-->
<ca-daterangepicker  [(ngModel)]="range"></ca-daterangepicker>

<!-- Date range Picker attached to a popup to a text input !-->
<input class='form-control' caDateRangePicker [caInputAddon] [(ngModel)]="range" />

<!-- Date/Time Picker standalone component !-->
<ca-datetimepicker [(ngModel)]="datetime"></ca-datetimepicker>

<!-- Date/Time Picker attached to a popup to a text input !-->
<input class='form-control' caDateTimePicker [caInputAddon][(ngModel)]="datetime" />

<!-- Date Picker standalone component !-->
<ca-datepicker [(ngModel)]="datetime"></ca-datepicker>

<!-- Date/Time Picker attached to a popup to a text input !-->
<input class='form-control' caDatePicker [caInputAddon] [(ngModel)]="date" />
``` 


## TODO

The library needs better documentation, more samples and a demo site. 

## License

MIT © Sherif Elmetainy \(Code Art\)
