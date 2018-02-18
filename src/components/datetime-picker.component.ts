import { Component, EventEmitter, ChangeDetectorRef, Inject, OnDestroy, Input, forwardRef } from "@angular/core";
import { BaseDatePickerAccessor } from "../base-date-picker-accessor";
import { ICultureService, ITypeConverterService, CANG_TYPE_CONVERTER_SERVICE, CANG_CULTURE_SERVICE } from "@code-art/angular-globalize";
import { Subscription } from "rxjs/Subscription";
import { similarInLocal, createDate, applyMixins } from "../util";
import { ITimePickerOptions, IDateTimePicker, IBaseValueAccessor } from "../interfaces";
import { TimePickerOptions } from "../base-time-value-accessor";
import { NG_VALUE_ACCESSOR } from "@angular/forms";


@Component({
    selector: 'ca-datetimepicker',
    templateUrl: './templates/datetime-picker.component.html',
    styleUrls: ['./styles/datetime-picker.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimePickerComponent), multi: true
    }]
})
export class DateTimePickerComponent extends BaseDatePickerAccessor<IDateTimePicker> implements OnDestroy, IDateTimePicker {

    @Input() minutesIncrement: number;
    @Input() secondsIncrement: number;
    @Input() showSeconds: boolean;

    parent: IBaseValueAccessor<IDateTimePicker> & IDateTimePicker;

    time: boolean = false;
    constructor(@Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService,
        @Inject(ChangeDetectorRef) changeDetector?: ChangeDetectorRef) {
        super(cultureService, converterService, changeDetector);
        this.rangeSelection = false;
    }

    get dateValue(): Date {
        let d = this.value;
        if (d instanceof Date) {
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            return d;
        }
        return null;
    }

    set dateValue(val: Date) {
        if (val instanceof Date) {
            let d = new Date(val.getFullYear(), val.getMonth(), val.getDate());
            let oldVal = this.value;
            if (oldVal instanceof Date) {
                d.setHours(oldVal.getHours());
                d.setMinutes(oldVal.getMinutes());
                d.setSeconds(oldVal.getSeconds());
                d.setMilliseconds(oldVal.getMilliseconds());
            }
            this.value = d;
        }
        else {
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
        let d = this.value;
        if (d instanceof Date) {
            return ((d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds()) * 1000;
        }
        return null;
    }
}

applyMixins(DateTimePickerComponent, TimePickerOptions);
