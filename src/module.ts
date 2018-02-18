import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalizationServicesModule, GlobalizationModule } from '@code-art/angular-globalize';

import { DatePickerComponent, DateRangePickerComponent } from './components/date-picker.component';
import { DaysViewComponent } from './components/days-view.component';
import { MonthsViewComponent } from './components/months-view.component';
import { YearsViewComponent } from './components/years-view.component';
import { NextPreviousComponent } from './components/next-prev.component';
import { DatePickerPopupComponent, DateRangePickerPopupComponent } from './components/date-picker-popup.component';
import { InputAddonHostComponent } from './components/input-addon-host.component';
import { TimePickerComponent } from './components/time-picker.component';
import { PopupComponent } from './components/popup.component';
import { PopupHostDirective } from './directives/popup-host.directive';

import { InputAddonDirective } from './directives/input-addon.directive';
import { DatePickerDirective, DateRangePickerDirective } from './directives/date-picker.directive';
import { TimePickerDirective } from './directives/time-picker.directive';

@NgModule({
    declarations: [ 
        DatePickerComponent, 
        DateRangePickerComponent,
        DaysViewComponent, 
        MonthsViewComponent, 
        NextPreviousComponent, 
        YearsViewComponent,
        InputAddonDirective,
        DatePickerPopupComponent,
        DateRangePickerPopupComponent,
        InputAddonHostComponent,
        TimePickerComponent, 
        PopupComponent,
        DatePickerDirective,
        DateRangePickerDirective,
        TimePickerDirective,
        PopupHostDirective
        ],
    exports: [DatePickerComponent, DateRangePickerComponent, InputAddonDirective, DatePickerDirective, DateRangePickerDirective, TimePickerComponent, TimePickerDirective ],
    entryComponents: [DatePickerPopupComponent, DateRangePickerPopupComponent, InputAddonHostComponent, PopupComponent, TimePickerComponent],
    imports: [ GlobalizationServicesModule, GlobalizationModule, CommonModule, FormsModule ]
})
export class DatePickerModule {

}