import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalizationServicesModule, GlobalizationModule } from '@code-art/angular-globalize';

import { DatePickerComponent } from './components/date-picker.component';
import { DaysViewComponent } from './components/days-view.component';
import { MonthsViewComponent } from './components/months-view.component';
import { YearsViewComponent } from './components/years-view.component';
import { NextPreviousComponent } from './components/next-prev.component';
import { DatePickerDirective } from './directives/date-picker.directive';
import { DatePickerPopupComponent } from './components/date-picker-popup.component';
import { InputAddonHostComponent } from './components/input-addon-host.component';

import { InputAddonDirective } from './directives/input-addon.directive';

@NgModule({
    declarations: [ 
        DatePickerComponent, 
        DaysViewComponent, 
        MonthsViewComponent, 
        NextPreviousComponent, 
        YearsViewComponent,
        InputAddonDirective,
        DatePickerDirective,
        DatePickerPopupComponent,
        InputAddonHostComponent,
        ],
    exports: [ DatePickerComponent, InputAddonDirective, DatePickerDirective ],
    entryComponents: [ DatePickerPopupComponent, InputAddonHostComponent ],
    imports: [ GlobalizationServicesModule, GlobalizationModule, CommonModule ]
})
export class DatePickerModule {

}