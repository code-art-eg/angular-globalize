import { Input, Component, Inject, EventEmitter, Output, HostListener, OnInit } from '@angular/core';
import { IGlobalizationService, CANG_GLOBALIZATION_SERVICE } from '@code-art/angular-globalize';
import { addDays, IMonthYearSelection, sevenArray, sixArray, formatYear, dateInRange, KEY_CODE, NextPrevAction, createDate, isRightToLeft } from '../util';

@Component({
    selector: 'ca-days-view',
    templateUrl: './days-view.component.html',
    styleUrls: ['./days-view.component.less']
})
export class DaysViewComponent implements OnInit {

    constructor( @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService
    ) {
        const date = createDate();
        this.month = date.getUTCMonth();
        this.year = date.getUTCFullYear();
        this.weekStart = 0;
        this._calculated = false;

        this._allDays = null;
        this._viewEndDate = null;
        this._viewEndDate = null;
        this._startDate = null;
        this._endDate = null;
        this.handleKeyboardEvents = false;

        this.dateClicked = new EventEmitter<Date>();
        this.command = new EventEmitter<IMonthYearSelection>();
    }

    ngOnInit(): void {
        this._focusDate = null;
    }

    private _month: number;
    private _weekStart: number;
    private _year: number;
    private _calculated: boolean;
    private _startDate: Date;
    private _endDate: Date;
    private _viewStartDate: Date;
    private _viewEndDate: Date;
    private _allDays: Date[];
    private _nextPrevText: string;
    private _locale: string;
    private _focusDate: Date;

    readonly sevenArray = sevenArray;
    readonly sixArray = sixArray;
    @Input() dir: string = 'ltr';

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (!this.handleKeyboardEvents) {
            return;
        }
        if (event.keyCode === KEY_CODE.LEFT_ARROW) {
            this.addFocusDate(isRightToLeft(this.locale) ? 1 : -1);
        } else if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
            this.addFocusDate(isRightToLeft(this.locale) ? -1 : 1);
        } else if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.addFocusDate(-7);
        } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.addFocusDate(7);
        } else if (event.keyCode === KEY_CODE.ENTER && this._focusDate) {
            if (this.onClick(this._focusDate)) {
                this._focusDate = null;
            }
        }
    }

    private addFocusDate(days: number): void {
        if (this._focusDate) {
            this._focusDate = addDays(this._focusDate, days);
        }
        else if (this.selectionStart && dateInRange(this.selectionStart, this.viewStartDate, this.viewEndDate)) {
            this._focusDate = this.selectionStart;
        }
        else if (this.todayDate && dateInRange(this.todayDate, this.viewStartDate, this.viewEndDate)) {
            this._focusDate = this.todayDate;
        }
        else {
            this._focusDate = this.startDate;
        }
        if (!dateInRange(this._focusDate, this.viewStartDate, this.viewEndDate)) {
            this.command.emit({
                month: this._focusDate.getUTCMonth(),
                year: this._focusDate.getUTCFullYear(),
            });
        }
    }

    @Input()
    homeButton: boolean;

    @Input()
    resetButton: boolean;

    @Input()
    todayHighlight: boolean;

    @Input()
    handleKeyboardEvents: boolean;

    @Input()
    set locale(val: string) {
        this._locale = val;
        this._calculated = false;
    }

    get locale(): string {
        return this._locale;
    }

    get month(): number {
        return this._month;
    }

    @Input()
    highlightDays: number;

    @Input()
    selectionStart: Date;

    @Input()
    selectionEnd: Date;

    @Input()
    todayDate: Date;

    @Input()
    maxDate: Date;

    @Input()
    minDate: Date;

    @Output()
    dateClicked: EventEmitter<Date>;
    @Output()
    command: EventEmitter<IMonthYearSelection>;

    @Input()
    set month(val: number) {
        this._month = val;
        this._calculated = false;
    };

    get weekStart(): number {
        return this._weekStart;
    }

    @Input()
    set weekStart(val: number) {
        this._weekStart = val;
        this._calculated = false;
    }

    get year(): number {
        return this._year;
    }

    @Input()
    set year(val: number) {
        this._year = val;
        this._calculated = false;
    }

    get nextPrevText(): string {
        this.calculate();
        return this._nextPrevText;
    }

    private calculate() {
        if (!this._calculated) {
            this._startDate = createDate(this.year, this.month, 1);
            this._endDate = createDate(this.year, this.month,
                this.globalizationService.getCalendar(this.locale).getDaysInMonth(this.year, this.month));

            let diff = (this._startDate.getDay() - this.weekStart + 7) % 7;
            if (diff === 0) {
                this._viewStartDate = this._startDate;
            } else {
                this._viewStartDate = addDays(this._startDate, -diff);
            }
            this._viewEndDate = addDays(this._viewStartDate, 41);

            this._allDays = [];
            let d = this._viewStartDate;
            for (let i = 0; i < 42; i++) {
                this._allDays.push(d);
                d = addDays(d, 1);
            }
            this._nextPrevText = this.globalizationService.getMonthName(this.month, this.locale) +
                ' ' + formatYear(this.globalizationService, this.year, this.locale);
            if (!dateInRange(this._focusDate, this._viewStartDate, this._viewEndDate)) {
                this._focusDate = null;
            }
            this._calculated = true;
        }
    }

    get startDate(): Date {
        this.calculate()
        return this._startDate;
    }

    get endDate(): Date {
        this.calculate();
        return this._endDate;
    }

    get viewStartDate(): Date {
        this.calculate();
        return this._viewStartDate;
    }

    get viewEndDate(): Date {
        this.calculate();
        return this._viewEndDate;
    }

    get allDays(): Date[] {
        this.calculate();
        return this._allDays;
    }


    public onClick(date: Date): boolean {
        if (!dateInRange(date, this.minDate, this.maxDate)) {
            return false;
        }
        this.dateClicked.emit(date);
        return true;
    }

    public onNextPrevClicked(event: NextPrevAction) {
        if (event === 'next') {
            this.command.emit({ month: this.month + 1 });
        }
        else if (event === 'prev') {
            this.command.emit({ month: this.month - 1 });
        }
        else if (event === 'text') {
            this.command.emit({ view: 'months' });
        }
        else if (event === 'home') {
            this.command.emit({ view: 'home' });
        }
        else if (event === 'reset') {
            this.command.emit({ reset: true });
        }
    }

    public getClasses(date: Date): { [key: string]: boolean } {
        let classes: { [key: string]: boolean } = { 'day': true };
        if (date.getUTCMonth() !== this.month
            || date.getUTCFullYear() !== this.year
        ) {
            classes['other'] = true;
        }
        if (!dateInRange(date, this.minDate, this.maxDate)) {
            classes['disabled'] = true;
        }
        if (this.selectionStart && this.selectionEnd &&
            date.valueOf() === this.selectionEnd.valueOf() && date.valueOf() !== this.selectionStart.valueOf()) {
            classes['selection-end'] = true;
            if (this.selectionStart && this.selectionEnd.valueOf() !== this.selectionStart.valueOf()) {
                classes['multi'] = true;
            }
        }
        else if (this.selectionStart &&
            date.valueOf() === this.selectionStart.valueOf()) {
            classes['selection-start'] = true;
            if (this.selectionEnd && this.selectionEnd.valueOf() !== this.selectionStart.valueOf()) {
                classes['multi'] = true;
            }
        }
        if (this.selectionStart && this.selectionEnd && dateInRange(date, this.selectionStart, this.selectionEnd)) {
            classes['selected'] = true;
        }
        if (this.todayHighlight && this.todayDate && date.valueOf() === this.todayDate.valueOf()) {
            classes['today'] = true;
        }
        if (this.highlightDays & (1 << date.getUTCDay())) {
            classes['highlight'] = true;
        }
        if (this._focusDate && this._focusDate.valueOf() === date.valueOf()) {
            classes['focused'] = true;
        }
        return classes;
    }
}