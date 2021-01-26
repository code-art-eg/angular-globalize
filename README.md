# @code-art-eg/angular-globalize

## About the library

The ```@code-art-eg/angular-globalize``` library is a javascript library that provides pipes for date, number and currency formatting for [Angular 11](https://angular.io).
It also provides services for parsing and formatting dates and numbers as well as setting the current culture. It depends on and leverages the [globalize](https://github.com/globalizejs) javascript library for performing this.

## Consuming the library

### 1. Installing the library

To install the library in your Angular application you need to run the following commands:

```bash
$ ng add @code-art-eg/angular-globalize
```
**Note:** *Since version 3.x of this library was rewritten, Versions 1.x and 2.x of the library available on npmjs are not compatible with this version.*

**Note 2:** *Starting from version 8, the major version numbers of the library now follows the major angular version supported.*


### 2. Use the library pipes in your components

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

By default the library will use the value provided by [LOCALE_ID](https://angular.io/api/core/LOCALE_ID) in Angular. If not available, it will use the browser culture. However, the current culture will always be one of the supported cultures. If the The LOCALE_ID or browser culture are not in the supported cultures, the first culture will be used as the default. To change current culture you can is the ```CurrentCultureService``` service which can be injected in your component or service.

Example: 

```typescript
import { Component } from '@angular/core';

import { CurrentCultureService } from '@code-art-eg/angular-globalize';

@Component({
    selector: 'app-change-culture',
    template: `
        <button (click)="changeCulture('en-GB')">English (United Kingdom)</button>
        <button (click)="changeCulture('ar-EG')">Arabic (Egypt)</button>
        <button (click)="changeCulture('de')">German (Germany)</button>
    `
})
export class ChangeCultureComponent {
    constructor(public readonly cultureService: CurrentCultureService) {
    }
    
    public changeCulture(culture: string): void {
        this.cultureService.currentCulture = culture;
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
    declarations: [AppComponent, ChangeCultureComponent],
    imports: [BrowserModule,
         AngularGlobalizeModule.forRoot(['en-GB', 'de', 'ar-EG']), // Import this only in root app module
         AngularGlobalizeModule, // import this in every module where the pipes and directives are needed.
        ],
    providers: [
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
