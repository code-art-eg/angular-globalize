import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES } from '@code-art/angular-globalize';
import { loadGlobalizeData } from '../../projects/angular-globalize/src/test/globalize-data-loader';

import 'globalize/currency';
import 'globalize/date';
import 'globalize/number';
import 'globalize/plural';

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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    loadGlobalizeData();
  }
}
