import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from "@angular/core";
import { CurrentCultureService, GlobalizationService } from "@code-art/angular-globalize";
import { formatYear, IMonthYearSelection, KEY_CODE, NextPrevAction, ViewType } from "../util";

@Component({
    selector: "ca-years-view",
    styleUrls: ["./year-month-view.less"],
    templateUrl: "./years-view.component.html",
})
export class YearsViewComponent implements OnInit {
    @Input() public homeButton: boolean;
    @Input() public resetButton: boolean;
    @Output() public command: EventEmitter<IMonthYearSelection>;
    @Input() public minYear: number;
    @Input() public maxYear: number;
    @Input() public month: number;
    @Input() public handleKeyboardEvents: boolean;

    public focusRange: number;

    private _year: number;
    private _locale: string;
    private _ranges: string[];
    private _calculated: boolean;
    private _nextPrevText: string;
    private _numberOfYears: number;

    constructor(private readonly cultureService: CurrentCultureService,
                private readonly globalizationService: GlobalizationService) {
        this._year = undefined;
        this._locale = undefined;
        this.month = undefined;
        this.command = new EventEmitter<IMonthYearSelection>();
        this._numberOfYears = 1;
        this._calculated = false;
        this._ranges = null;
        this._nextPrevText = null;
        this.focusRange = null;
        this.handleKeyboardEvents = false;
    }

    public ngOnInit(): void {
        this.focusRange = null;
    }

    @HostListener("window:keyup", ["$event"])
    public keyEvent(event: KeyboardEvent) {
        if (!this.handleKeyboardEvents) {
            return;
        }
        if (event.keyCode === KEY_CODE.LEFT_ARROW) {
            this.addRange(this.cultureService.isRightToLeft(this.locale) ? 1 : -1);
        } else if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
            this.addRange(this.cultureService.isRightToLeft(this.locale) ? -1 : 1);
        } else if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.addRange(-3);
        } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.addRange(3);
        } else if (event.keyCode === KEY_CODE.ENTER) {
            if (typeof this.focusRange === "number") {
                this.rangeClick(this.focusRange);
                this.focusRange = null;
            } else {
                this.rangeClick(this.selectedRange);
            }
        }
    }

    @Input()
    set year(val: number) {
        this._year = val;
        this._calculated = false;
    }

    get year(): number {
        return this._year;
    }

    @Input()
    set numberOfYears(val: number) {
        this._numberOfYears = val;
        this._calculated = false;
    }

    get numberOfYears(): number {
        return this._numberOfYears;
    }

    @Input()
    set locale(val: string) {
        this._locale = val;
        this._calculated = false;
    }

    get locale(): string {
        return this._locale;
    }

    get nextPrevText(): string {
        this.calculate();
        return this._nextPrevText;
    }

    get ranges(): string[] {
        this.calculate();
        return this._ranges;
    }

    public onNextPrevClicked(evt: NextPrevAction): void {
        if (evt === "home") {
            this.command.emit({
                view: "home",
            });
            return;
        } else if (evt === "reset") {
            this.command.emit({
                reset: true,
            });
            return;
        }
        const newEvt: IMonthYearSelection = {};
        if (evt === "next") {
            newEvt.year = this.year + 10 * this.numberOfYears;
        } else if (evt === "prev") {
            newEvt.year = this.year - 10 * this.numberOfYears;
        } else if (evt === "text") {
            newEvt.view = this.numberOfYears === 1 ? "decades" : "centuries";
        }
        this.command.emit(newEvt);
    }

    public rangeClick(i: number): void {
        if (this.isDisabled(i)) {
            return;
        }
        let view = "months";
        if (this.numberOfYears === 10) {
            view = "years";
        }
        if (this.numberOfYears === 100) {
            view = "decades";
        }
        this.command.emit({
            view: view as ViewType,
            year: this.getYear(i),
        });
    }

    public isDisabled(i: number): boolean {
        const year = this.getYear(i);
        if (year > this.maxYear) {
            return true;
        }
        const end = year + this.numberOfYears - 1;
        return end < this.minYear;
    }

    // noinspection JSMethodCanBeStatic
    public isOther(i: number): boolean {
        return i >= 10;
    }

    public isSelected(i: number): boolean {
        return i === this.selectedRange;
    }

    public isRange(): boolean {
        return this.numberOfYears !== 1;
    }

    private addRange(num: number): void {
        if (typeof this.focusRange === "number") {
            this.focusRange += num;
            if (this.focusRange < 0 || this.focusRange > 11) {
                let newYear = this.year;
                while (this.focusRange < 0) {
                    this.focusRange += 10;
                    newYear -= this.numberOfYears * 10;
                }
                while (this.focusRange > 11) {
                    this.focusRange -= 10;
                    newYear += this.numberOfYears * 10;
                }
                this.command.emit({
                    year: newYear,
                });
            }
        } else {
            this.focusRange = this.selectedRange;
        }
    }

    private calculate() {
        if (!this._calculated) {
            const y = this.year - this.year % (this.numberOfYears * 10);
            this._nextPrevText = this.getRange(y, this.numberOfYears * 10);
            this._ranges = [];
            for (let i = 0; i < 12; i++) {
                this._ranges.push(this.getRange(y + i * this.numberOfYears, this.numberOfYears));
            }
            this._calculated = true;
        }
    }

    private getRange(year: number, num: number): string {
        if (num === 1) {
            return formatYear(this.globalizationService, year, this.locale);
        } else {
            return formatYear(this.globalizationService, year, this.locale)
                + " - " + formatYear(this.globalizationService, year + num - 1, this.locale);
        }
    }

    private get startYear(): number {
        return this.year - this.year % (this.numberOfYears * 10);
    }

    private getYear(i: number): number {
        return this.startYear + i * this.numberOfYears;
    }

    private get selectedRange(): number {
        return Math.floor((this.year - this.startYear) % (this.numberOfYears * 10) / this.numberOfYears);
    }
}
