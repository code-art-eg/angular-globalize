import { Input, Component, Inject, EventEmitter, Output, HostListener, OnInit } from '@angular/core';
import { IGlobalizationService, CANG_GLOBALIZATION_SERVICE } from '@code-art/angular-globalize';
import { IMonthYearSelection, twelveArray, formatYear, KEY_CODE, NextPrevAction, createDate } from '../util';

@Component({
    selector: 'months-view',
    templateUrl: './months-view.component.html',
    styleUrls: ['year-month-view.less']
})
export class MonthsViewComponent implements OnInit {

    constructor( @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService) {
        this._year = undefined;
        this._locale = undefined;
        this.month = undefined;
        this.nextPrevText = undefined;
        this.command = new EventEmitter<IMonthYearSelection>();
        this.focusMonth = null;
        this.handleKeyboardEvents = false;
    }

    ngOnInit(): void {
        this.focusMonth = null;
    }

    private _year: number;
    private _locale: string;
    focusMonth: number;

    @Input()
    handleKeyboardEvents: boolean;

    @Output()
    command: EventEmitter<IMonthYearSelection>;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (!this.handleKeyboardEvents) {
            return;
        }
        if (event.keyCode === KEY_CODE.LEFT_ARROW) {
            this.addFocusMonth(-1);
        } else if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
            this.addFocusMonth(1);
        } else if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.addFocusMonth(-3);
        } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.addFocusMonth(3);
        } else if (event.keyCode === KEY_CODE.ENTER) {
            this.monthClick(typeof(this.focusMonth) === 'number' ? this.focusMonth : this.month);
            this.focusMonth = null;
        }
    }

    private addFocusMonth(val: number): void {
        if (typeof this.focusMonth === 'number') {
            this.focusMonth = this.focusMonth + val;
            if (this.focusMonth < 0 || this.focusMonth > 11) {
                let newYear = this.year;
                while (this.focusMonth < 0) {
                    this.focusMonth += 12;
                    newYear--;
                }
                while (this.focusMonth > 11) {
                    this.focusMonth -= 12;
                    newYear++;
                }
                this.command.emit({
                    year: newYear
                });
            }
        } else {
            this.focusMonth = this.month;
        }
    }

    @Input()
    homeButton: boolean;
    
    @Input()
    resetButton: boolean;

    @Input()
    maxDate: Date;
    @Input()
    minDate: Date;

    @Input()
    month: number;

    @Input()
    set year(val: number) {
        this.nextPrevText = formatYear(this.globalizationService, val, this.locale);
        this._year = val;
    }

    get year(): number {
        return this._year;
    }

    @Input()
    set locale(val: string) {
        this._locale = val;
        this.nextPrevText = formatYear(this.globalizationService, this.year, val);
    }

    get locale(): string {
        return this._locale;
    }

    nextPrevText: string;

    readonly months = twelveArray;

    onNextPrevClicked(evt: NextPrevAction): void {
        if (evt === 'next') {
            this.command.emit({
                year: this.year + 1
            });
        } else if (evt === 'prev') {
            this.command.emit({
                year: this.year - 1
            });
        } else if (evt === 'text') {
            this.command.emit({
                view: 'years'
            });
        } else if (evt === 'home') {
            this.command.emit({
                view: 'home'
            });
        } else if (evt === 'reset') {
            this.command.emit({
                reset: true
            });
        }
    }

    monthClick(month: number): void {
        if (this.isDisabled(month)) {
            return;
        }
        this.command.emit({
            month: month,
            view: 'days'
        });
    }

    isDisabled(month: number): boolean {
        if (this.maxDate) {
            let start = createDate(this.year, month, 1);
            if (start.valueOf() > this.maxDate.valueOf())
                return true;
        }
        if (this.minDate) {
            let end = createDate(this.year, month, this.globalizationService.getCalendar(this.locale).getDaysInMonth(this.year, month));
            if (end.valueOf() < this.minDate.valueOf())
                return true;
        }
        return false;
    }
}