# @code-art/angular-datepicker

## About the library

The ```@code-art/angular-datepicker``` library is a javascript library that a datepicker for [Angular 5](https://angular.io). 

## Consuming the library

The library depends on [angular-globalize](https://github.code/sherif-elmetainy/angular-globalize) and [globalize](https://github.com/globalizejs/globalize) for localization and date formatting functionality. Please refer to those packages for usage.

Install the library in your Angular application you need to run the following commands:

```bash
$ npm install @code-art/angular-datepicker
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject } from '@angular/core';

import { AppComponent } from './app.component';

// Minimum imports classes library
import {
    DatePickerModule
} from '@code-art/angular-datepicker';


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
<datepicker></datepicker>
``` 


## TODO

The library needs better documentation, more samples and a demo site. 

## License

MIT © Sherif Elmetainy \(Code Art\)
