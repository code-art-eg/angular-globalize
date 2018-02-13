import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalizationServicesModule, GlobalizationModule } from '@code-art/angular-globalize';

import { DatePickerComponent } from './components/date-picker.component';
import { DaysViewComponent } from './components/days-view.component';
import { MonthsViewComponent } from './components/months-view.component';
import { YearsViewComponent } from './components/years-view.component';
import { NextPreviousComponent } from './components/next-prev.component';

@NgModule({
    declarations: [ DatePickerComponent, DaysViewComponent, MonthsViewComponent, NextPreviousComponent, YearsViewComponent ],
    exports: [ DatePickerComponent ],
    imports: [ GlobalizationServicesModule, GlobalizationModule, CommonModule ]
})
export class DatePickerModule {

}