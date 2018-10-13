import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES } from '@code-art/angular-globalize';

import { AppComponent } from './app.component';

import { AngularDatepickerModule } from '@code-art/angular-datepicker';
import { loadGlobalizeData } from 'projects/angular-datepicker/src/test/globalize-data-loader';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';

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
    CommonModule,
    FormsModule,
    AngularGlobalizeModule,
    AngularDatepickerModule,
    AngularGlobalizeModule.forRoot(),
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
