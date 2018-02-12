import { NgModule } from '@angular/core';
import { GlobalizationServicesModule } from '@code-art/angular-globalize';

import { DatePickerComponent } from './components/date-picker.component'


@NgModule({
    declarations: [ DatePickerComponent ],
    exports: [ DatePickerComponent ],
    imports: [ GlobalizationServicesModule ]
})
export class DatePickerModule {

}