import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  AngularGlobalizeModule,
  CANG_LOCALE_PROVIDER,
  CANG_SUPPORTED_CULTURES,
  CookieLocaleProviderService,
  CANG_COOKIE_NAME
  } from '@code-art/angular-globalize';
import 'globalize/currency';
import 'globalize/date';
import 'globalize/number';
import 'globalize/plural';
import { loadGlobalizeData } from 'projects/angular-globalize/src/test/globalize-data-loader';
import { AppComponent } from './app.component';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';


@NgModule({
  declarations: [
    AppComponent,
    LanguageSwitchComponent
  ],
  imports: [
    BrowserModule,
    AngularGlobalizeModule.forRoot(),
    AngularGlobalizeModule,
  ],
  providers: [
    { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG'] },
    { provide: CANG_COOKIE_NAME, useValue: 'lang' },
    { provide: CANG_LOCALE_PROVIDER, useClass: CookieLocaleProviderService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    loadGlobalizeData();
  }
}
