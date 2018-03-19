import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalizationServicesModule, GlobalizationModule } from '@code-art/angular-globalize';

import { DaysViewComponent } from './components/days-view.component';
import { MonthsViewComponent } from './components/months-view.component';
import { YearsViewComponent } from './components/years-view.component';
import { NextPreviousComponent } from './components/next-prev.component';

import { DatePickerComponent, DateRangePickerComponent } from './components/date-picker.component';
import { TimePickerComponent } from './components/time-picker.component';
import { DateTimePickerComponent } from './components/datetime-picker.component';

import { PopupComponent } from './components/popup.component';
import { InputAddonHostComponent } from './components/input-addon-host.component';

import { PopupHostDirective } from './directives/popup-host.directive';
import { InputAddonDirective } from './directives/input-addon.directive';
import { DatePickerDirective, DateRangePickerDirective } from './directives/date-picker.directive';
import { TimePickerDirective } from './directives/time-picker.directive';
import { DateTimePickerDirective } from './directives/datetime-picker.directive';

@NgModule({
    declarations: [ 
        DatePickerComponent, 
        DateTimePickerComponent,
        DateRangePickerComponent,
        DaysViewComponent, 
        MonthsViewComponent, 
        NextPreviousComponent, 
        YearsViewComponent,
        InputAddonHostComponent,
        TimePickerComponent, 
        PopupComponent,

        DatePickerDirective,
        DateRangePickerDirective,
        TimePickerDirective,
        DateTimePickerDirective,

        InputAddonDirective,
        PopupHostDirective
        ],
    exports: [DatePickerComponent, DateRangePickerComponent, InputAddonDirective, DatePickerDirective, DateRangePickerDirective, TimePickerComponent, TimePickerDirective, DateTimePickerComponent, DateTimePickerDirective ],
    entryComponents: [InputAddonHostComponent, PopupComponent, TimePickerComponent, DatePickerComponent, DateRangePickerComponent, DateTimePickerComponent],
    imports: [ GlobalizationModule, CommonModule, FormsModule ]
})
export class DatePickerModule {

}