import { NgModule } from '@angular/core';
import { AngularGlobalizeModule } from '@code-art/angular-globalize';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ICON_COMPONENTS } from './components/icons/index';
import { NextPreviousComponent } from './components/next-prev/next-prev.component';
import { MonthsViewComponent } from './components/months-view/months-view.component';
import { YearsViewComponent } from './components/years-view/years-view.component';
import { DaysViewComponent } from './components/days-view/days-view.component';
import { PopupHostDirective } from './directives/popup-host.directive';
import { PopupComponent } from './components/popup/popup.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DateRangePickerComponent } from './components/date-picker/date-range-picker.component';
import { DateTimePickerComponent } from './components/datetime-picker/datetime-picker.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { DatePickerDirective } from './directives/date-picker.directive';
import { DateRangePickerDirective } from './directives/date-range-picker.directive';
import { DateTimePickerDirective } from './directives/datetime-picker.directive';
import { TimePickerDirective } from './directives/time-picker.directive';


@NgModule({
  imports: [
    AngularGlobalizeModule, CommonModule, FormsModule
  ],
  declarations: [
    ICON_COMPONENTS,
    NextPreviousComponent,
    DaysViewComponent,
    MonthsViewComponent,
    YearsViewComponent,
    PopupHostDirective,
    PopupComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
    DatePickerDirective,
    DateRangePickerDirective,
    DateTimePickerDirective,
    TimePickerDirective,
  ],
  exports: [
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
    DatePickerDirective,
    DateRangePickerDirective,
    DateTimePickerDirective,
    TimePickerDirective,
  ],
  entryComponents: [
    PopupComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
  ]
})
export class AngularDatepickerModule { }
