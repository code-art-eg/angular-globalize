import { ChangeDetectorRef, Component, forwardRef, Input, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { CurrentCultureService, TypeConverterService } from "@code-art/angular-globalize";
import { BaseDatePickerAccessor } from "../base-date-picker-accessor";
import { IBaseValueAccessor, IDateTimePicker } from "../interfaces";
import { TimePickerOptions } from "../time-picker-options";
import { applyMixins, createDate, similarInLocal } from "../util";

@Component({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimePickerComponent),
    }],
    selector: "ca-datetimepicker",
    styleUrls: ["./datetime-picker.component.less"],
    templateUrl: "./datetime-picker.component.html",
})
export class DateTimePickerComponent
    extends BaseDatePickerAccessor<IDateTimePicker> implements OnDestroy, IDateTimePicker {

    @Input() public minutesIncrement: number;
    @Input() public secondsIncrement: number;
    @Input() public showSeconds: boolean;

    public parent: IBaseValueAccessor<IDateTimePicker> & IDateTimePicker;

    public time: boolean = false;

    constructor(cultureService: CurrentCultureService,
                converterService: TypeConverterService,
                changeDetector?: ChangeDetectorRef) {
        super(cultureService, converterService, changeDetector);
        this.rangeSelection = false;
    }

    get dateValue(): Date {
        const d = this.value;
        if (d instanceof Date) {
            const newD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            if (newD.getFullYear() !== d.getFullYear()) {
                newD.setFullYear(d.getFullYear());
            }
            return newD;
        }
        return null;
    }

    set dateValue(val: Date) {
        if (val instanceof Date) {
            const d = new Date(val.getFullYear(), val.getMonth(), val.getDate());
            if (d.getFullYear() !== val.getFullYear()) {
                d.setFullYear(val.getFullYear());
            }
            const oldVal = this.value;
            if (oldVal instanceof Date) {
                d.setHours(oldVal.getHours());
                d.setMinutes(oldVal.getMinutes());
                d.setSeconds(oldVal.getSeconds());
                d.setMilliseconds(oldVal.getMilliseconds());
            }
            this.value = d;
        } else {
            this.value = null;
        }
    }

    set timeValue(val: number) {
        if (val === null) {
            this.value = null;
        } else {
            let dateValue = this.dateValue;
            if (dateValue === null) {
                dateValue = similarInLocal(createDate());
            }
            dateValue = new Date(dateValue.getTime() + val);
            this.value = dateValue;
        }
    }

    get timeValue(): number {
        const d = this.value;
        if (d instanceof Date) {
            return ((d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds()) * 1000;
        }
        return null;
    }
}

applyMixins(DateTimePickerComponent, TimePickerOptions);
