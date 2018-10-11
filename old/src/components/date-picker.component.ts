import { ChangeDetectorRef, Component, forwardRef, Inject, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseDatePickerComponent } from "./base-date-picker.component";

@Component({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent),
    }],
    selector: "ca-datepicker",
    styleUrls: ["./date-picker.component.less"],
    templateUrl: "./date-picker.component.html",
})
export class DatePickerComponent extends BaseDatePickerComponent implements OnDestroy {
    public rangeSelection = false;

}
