import { Component, Input, Inject, OnDestroy, forwardRef, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CANG_CULTURE_SERVICE, ICultureService, ITypeConverterService, CANG_TYPE_CONVERTER_SERVICE } from '@code-art/angular-globalize';
import { IMonthYearSelection, ViewType, stripTime, maxDate, minDate, dateInRange, createDate, similarInUtc, similarInLocal, IDateRange, datesEqual, getMonthYear } from '../util';
import { debug } from 'util';
import { BaseDatePickerAccessor } from '../base-date-picker-accessor';

export abstract class BaseDatePickerComponent extends BaseDatePickerAccessor implements OnDestroy {
    private _month: number | number = null;
    private _year: number | null = null;
    private _startEndToggle: boolean = false;

    view: ViewType = 'days';

    constructor(@Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
        super(cultureService, converterService, changeDetector);
    }

    onDaysViewDayClick(date: Date): void {
        if (this.disabled || !dateInRange(date, this.minDateInternal, this.maxDateInternal)) {
            return;
        }
        if (!this.rangeSelection) {
            this.selectionStart = similarInLocal(date);
        }
        else {
            let s = this.selectionStartInternal;
            let e = this.selectionEndInternal;
            if (!s && !e) {
                s = date;
                e = date;
                this._startEndToggle = false;
            }
            else if (!e) {
                if (date.valueOf() < s.valueOf()) {
                    e = s;
                    s = date;
                } else if (date.valueOf() > s.valueOf()) {
                    e = date;
                } else {
                    s = null;
                }
                this._startEndToggle = false;
            }
            else if (!s) {
                if (date.valueOf() < e.valueOf()) {
                    s = date;
                } else if (date.valueOf() > e.valueOf()) {
                    s = e;
                    e = date;
                } else {
                    e = null;
                }
                this._startEndToggle = false;
            } else {
                if (s.valueOf() === e.valueOf()) {
                    if (date.valueOf() < s.valueOf()) {
                        s = date;
                        this._startEndToggle = true;
                    } else if (date.valueOf() > s.valueOf()) {
                        e = date;
                        this._startEndToggle = false;
                    }
                    else {
                        s = null;
                        e = null;
                        this._startEndToggle = false;
                    }
                } else {
                    if (date.valueOf() < s.valueOf()) {
                        s = date;
                        this._startEndToggle = true;
                    } else if (date.valueOf() > e.valueOf()) {
                        e = date;
                        this._startEndToggle = true;
                    }
                    else if (date.valueOf() > s.valueOf() && date.valueOf() < e.valueOf()) {
                        if (this._startEndToggle) {
                            e = date;
                            this._startEndToggle = false;
                        } else {
                            s = date;
                            this._startEndToggle = true;
                        }
                    }
                }
            }

            let val = s === null || e === null ? null : { from: s, to: e };
            this.value = val;
        }
        this.raiseOnTouch();
    }

    onCommand(evt: IMonthYearSelection): void {
        if (this.disabled) {
            return;
        }
        if (typeof (evt.month) === 'number') {
            this.month = evt.month;
        }
        if (typeof (evt.year) === 'number') {
            this.year = evt.year;
        }
        if (evt.view) {
            if (evt.view === 'home') {
                this.view = 'days';
                this.month = this.todayDate.getUTCMonth();
                this.year = this.todayDate.getUTCFullYear();
            }
            else {
                this.view = evt.view;
            }
        }
        if (evt.reset) {
            this.value = null;
            this._startEndToggle = false;
        }
        this.raiseOnTouch();
    }

    get todayDateInternal(): Date {
        return similarInUtc(this.todayDate);
    }

    get minDateInternal(): Date {
        return similarInUtc(this.minDate);
    }

    get maxDateInternal(): Date {
        return similarInUtc(this.maxDate);
    }

    get selectionStartInternal(): Date {
        return similarInUtc(this.selectionStart);
    }

    get selectionEndInternal(): Date {
        return similarInUtc(this.selectionEnd);
    }

    set month(val: number) {
        if (typeof val === 'number') {
            const [m, y] = getMonthYear(val, this.year);
            if (y < this.minYear || y > this.maxYear) {
                return;
            }
            this._month = m;
            this._year = y;
        } else {
            this._month = null;
        }
    }


    get month(): number {
        return typeof this._month === 'number' ? this._month :
            (this.selectionStartInternal || this.selectionEndInternal || this.todayDateInternal).getUTCMonth()
    }

    set year(val: number) {
        if (typeof val === 'number') {
            this._year = Math.max(this.minYear, Math.min(this.maxYear, val));
        }
        else {
            this._year = null;
        }
    }

    get year(): number {
        return typeof this._year === 'number' ? this._year :
            (this.selectionStartInternal || this.selectionEndInternal || this.todayDateInternal).getUTCFullYear()
    }

    get maxYear(): number {
        return this.maxDateInternal.getUTCFullYear();
    }

    get minYear(): number {
        return this.minDateInternal.getUTCFullYear();
    }
}

@Component({
    selector: 'ca-datepicker',
    templateUrl: './templates/date-picker.component.html',
    styleUrls: ['./styles/date-picker.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true
    }]
})
export class DatePickerComponent extends BaseDatePickerComponent implements OnDestroy {

    rangeSelection = false;
}

@Component({
    selector: 'ca-daterangepicker',
    templateUrl: './templates/date-picker.component.html',
    styleUrls: ['./styles/date-picker.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerComponent), multi: true
    }]
})
export class DateRangePickerComponent extends BaseDatePickerComponent implements OnDestroy {
    rangeSelection = true;
}