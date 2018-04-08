import {NgModule} from "@angular/core";
import {GlobalizeDirectionDirective} from "./directives/globalize-direction.directive";
import {GlobalizeCurrencyPipe} from "./pipes/globalize-currency.pipe";
import {GlobalizeDatePipe} from "./pipes/globalize-date.pipe";
import {GlobalizeDateTimePipe} from "./pipes/globalize-datetime.pipe";
import {GlobalizeDayPipe} from "./pipes/globalize-day.pipe";
import {GlobalizeDurationPipe} from "./pipes/globalize-duration.pipe";
import {GlobalizeMonthPipe} from "./pipes/globalize-month.pipe";
import {GlobalizeNumberPipe} from "./pipes/globalize-number.pipe";
import {GlobalizeTimePipe} from "./pipes/globalize-time.pipe";

@NgModule({
    declarations: [
        GlobalizeDatePipe,
        GlobalizeDateTimePipe,
        GlobalizeTimePipe,
        GlobalizeCurrencyPipe,
        GlobalizeNumberPipe,
        GlobalizeMonthPipe,
        GlobalizeDayPipe,
        GlobalizeDurationPipe,
        GlobalizeDirectionDirective,
    ],
    exports: [
        GlobalizeDatePipe,
        GlobalizeDateTimePipe,
        GlobalizeTimePipe,
        GlobalizeCurrencyPipe,
        GlobalizeNumberPipe,
        GlobalizeMonthPipe,
        GlobalizeDayPipe,
        GlobalizeDurationPipe,
        GlobalizeDirectionDirective,
    ],
})
export class GlobalizationModule {

}
