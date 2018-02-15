import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { Component, Input, Inject, OnDestroy, forwardRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CANG_CULTURE_SERVICE, ICultureService, ITypeConverterService, CANG_TYPE_CONVERTER_SERVICE } from '@code-art/angular-globalize';
import { isRightToLeft, IMonthYearSelection, ViewType, stripTime, maxDate, minDate, dateInRange, createDate, similarInUtc, similarInLocal, IDateRange, datesEqual } from '../util';

@Component({
    selector: 'ca-datepicker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true
    }]
})
export class DatePickerComponent implements OnDestroy, ControlValueAccessor {

    private static readonly maximumYear = 9999;
    private static readonly minimumYear = 0;
    private static readonly defaultMaxDate = createDate(DatePickerComponent.maximumYear, 11, 31);
    private static readonly defaultMinDate = createDate(DatePickerComponent.minimumYear, 0, 1);
    
    private _localeSubject = new ReplaySubject<string>();
    private _localeObservable = this._localeSubject.asObservable();
    private _localeSubscription = Observable.combineLatest(this._localeObservable, this.cultureService.cultureObservable)
            .subscribe({ next: vals => {
                const [localeVal, cultureVal] = vals;
                this.effectiveLocale = localeVal || cultureVal;
                this.dir = isRightToLeft(this.effectiveLocale) ? 'rtl' : 'ltr';
            }
        });
    
    constructor( @Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) private readonly converterService: ITypeConverterService
    ) {
        this.selectionStartInternal = null;
        this.selectionEndInternal = null;
        this.dir = isRightToLeft(this.cultureService.currentCulture) ? 'rtl' : 'ltr';
        this.locale = null;
        this.rangeSelection = false;
        this.effectiveLocale = this.cultureService.currentCulture;
        this.month = this.todayDate.getUTCMonth();
        this.year = this.todayDate.getUTCFullYear();
        this.view = 'days';
        this._isSelectionRange = false;
    }

    private tryGetDate(obj: any): Date {
        try {
            let d = this.converterService.convertToDate(obj, this.effectiveLocale);
            return d;
        }
        catch {
            return null;
        }
    }

    writeValue(obj: any): void {
        let d = this.tryGetDate(obj);
        if (d) {
            this.selectionEnd = null;
            this.selectionStart = d;
            if (this.rangeSelection) {
                this.selectionEnd = d;
            }
        } else if (Array.isArray(obj)) {
            this.selectionEnd = null;
            d = obj.length > 0 ? this.tryGetDate(obj[0]) : null;
            this.selectionStart = d;
            if (this.rangeSelection) {
                this.selectionEnd = obj.length > 1 ? this.tryGetDate(obj[1]) || d : d;
            }
        } else if (obj && typeof obj === 'object') {
            d = this.tryGetDate(obj.from);
            this.selectionEnd = null;
            this.selectionStart = d;
            if (this.rangeSelection) {
                d = this.tryGetDate(obj.to);
                this.selectionEnd = d;
            }
        } else {
            this.selectionStart = this.selectionEnd = null;
        }
    }

    private _onchange: (val: Date|IDateRange|null) => void;
    
    registerOnChange(fn: any): void {
        if (typeof fn === 'function') {
            this._onchange = fn;
        }
    }

    private raiseOnChange(): void {
        if (typeof this._onchange === 'function') {
            if (this.selectionStart) {
                if (this.rangeSelection) {
                    this._onchange({
                        from: this.selectionStart,
                        to: this.selectionEnd || this.selectionStart
                    });
                } else {
                    this._onchange(this.selectionStart);
                }
            } else {
                this._onchange(null);
            }
        }
    }

    private _ontouch: () => void;
    
    registerOnTouched(fn: any): void {
        if (typeof fn === 'function') {
            this._ontouch = fn;
        }
    }

    private raiseOnTouch(): void {
        if (typeof this._ontouch === 'function') {
            this._ontouch();
        }
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = !!isDisabled;
    }

    ngOnDestroy(): void {
        this._localeSubject.complete();
        this._localeSubscription.unsubscribe();
    }

    onDaysViewDayClick(date: Date): void {
        if (this.disabled) {
            return;
        }
        if (!this.rangeSelection) {
            this.selectionStartInternal = date;
        }
        else {
            if (this._isSelectionRange) {
                this.selectionEndInternal = date;
                this._isSelectionRange = false;
            } else {
                this.selectionStartInternal = date;
                this._isSelectionRange = true;
            }
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
            this.selectionStartInternal = this.selectionEndInternal = null;
        }
        this.raiseOnTouch();
    }

    private _locale: string;
    private _month: number;
    private _year: number;
    private _maxDate: Date;
    private _minDate: Date;
    private _selectionStart: Date;
    private _selectionEnd: Date;
    private _rangeSelection: boolean;
    private _isSelectionRange: boolean;

    view: ViewType;
    dir: string;
    effectiveLocale: string;

    @Input() disabled = false;
    @Input() homeButton = true;
    @Input() resetButton = true;
    @Input() handleKeyboardEvents = false;
    @Input() todayHighlight = true;
    

    @Input()
    set rangeSelection(val: boolean) {
        this._rangeSelection = !!val;
        if (!this._rangeSelection) {
            this.selectionEndInternal = null;
        }
    }

    get rangeSelection(): boolean {
        return !!this._rangeSelection;
    }

    @Input() set todayDate(val: Date) {
        this.todayDateInternal = similarInUtc(val);
    }
    get todayDate(): Date {
        return similarInLocal(this.todayDateInternal);
    }

    @Input() set selectionStart(val: Date) {

        this.selectionStartInternal = similarInUtc(val);
    }
    
    get selectionStart(): Date {
        return similarInLocal(this.selectionStartInternal);
    }

    @Input() set selectionEnd(val: Date) {
        this.selectionEndInternal = similarInUtc(val);
    }
    
    get selectionEnd(): Date {
        return similarInLocal(this.selectionEndInternal);
    }

    @Input() set minDate(val: Date) {
        this.minDateInternal = similarInUtc(val);
    }
    
    get minDate(): Date {
        return similarInLocal(this.minDateInternal);
    }
    
    @Input() set maxDate(val: Date) {
        this.maxDateInternal = similarInUtc(val);
    }
    
    get maxDate(): Date {
        return similarInLocal(this.maxDateInternal);
    }

    todayDateInternal = createDate();

    set minDateInternal(val: Date) {
        val = stripTime(val);
        val = maxDate(val, DatePickerComponent.defaultMinDate);
        val = minDate(val, this.maxDateInternal, DatePickerComponent.defaultMaxDate) || null;
        this._minDate = val;
        this.selectionStartInternal = this._selectionStart;
        this._selectionEnd = this._selectionEnd;
    }

    get minDateInternal(): Date {
        return this._minDate || DatePickerComponent.defaultMinDate;
    }

    set maxDateInternal(val: Date) {
        val = stripTime(val);
        val = minDate(val, DatePickerComponent.defaultMaxDate);
        val = maxDate(val, this.minDateInternal, DatePickerComponent.defaultMinDate) || null;
        this._maxDate = val;
    }

    get maxDateInternal(): Date {
        return this._maxDate || DatePickerComponent.defaultMaxDate;
    }

    set selectionStartInternal(val: Date) {
        val = stripTime(val);
        if (!dateInRange(val, this.minDateInternal, this.maxDateInternal)) {
            return;
        }
        val = minDate(val, this.selectionEndInternal);
        const changed = !datesEqual(val, this._selectionStart);
        this._selectionStart = val;
        if (val) {
            this.month = val.getUTCMonth();
            this.year = val.getUTCFullYear();
        }
        if (changed) {
            this.raiseOnChange();
        }
    };

    get selectionStartInternal(): Date {
        return this._selectionStart;
    }

    set selectionEndInternal(val: Date) {
        val = stripTime(val);
        if (!dateInRange(val, this.minDateInternal, this.maxDateInternal)) {
            return;
        }
        const changed = !datesEqual(val, this._selectionEnd);
        val = maxDate(val, this.selectionStartInternal);
        this._selectionEnd = val;
        if (val) {
            this.month = val.getUTCMonth();
            this.year = val.getUTCFullYear();
        }
        if (changed) {
            this.raiseOnChange();
        }
    };

    get selectionEndInternal(): Date {
        return this._selectionEnd;
    }

    @Input()
    set locale(val: string) {
        this._locale = val;
        this._localeSubject.next(val);
    }

    get locale(): string {
        return this._locale;
    }

    set month(val: number) {
        if (typeof val === 'number') {
            const maxMonth = this.maxMonths;
            while (val < 0) {
                val += maxMonth;
                this.year--;
            }
            while (val >= maxMonth) {
                this.year++;
                val -= maxMonth;
            }
            this._month = val;
        } else {
            this._month = this.todayDate.getUTCMonth();
        }
    }


    get month(): number {
        return this._month;
    }

    set year(val: number) {
        if (typeof val === 'number') {
            this._year = Math.max(this.minYear, Math.min(this.maxYear, val));
        }
        else {
            this._year = Math.min(this.maxYear, Math.max(this.minYear, this.todayDate.getUTCFullYear()));
        }
    }

    get year(): number {
        return this._year;
    }

    get maxMonths(): number {
        return 12;
    }

    get maxYear(): number {
        return this.maxDateInternal.getUTCFullYear();
    }

    get minYear(): number {
        return this.minDateInternal.getUTCFullYear();
    }
}